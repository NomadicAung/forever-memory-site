"use client";

import { useState } from "react";
import { Camera, Loader2, Sparkles, Trash2 } from "lucide-react";
import { aestheticOptions, budgetOptions, privacyNotice, regionOptions, spaceTypes } from "@/lib/room-glow-up/options";

async function prepareRoomImage(file: File): Promise<File> {
  const image = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not read image."));
      image.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    const maxSide = 1200;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.78));
    if (!blob) return file;
    return new File([blob], "room-glow-up.jpg", { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function RoomGlowUpForm() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [spaceType, setSpaceType] = useState("Bedroom");
  const [aesthetic, setAesthetic] = useState("Kawaii Pastel");
  const [budget, setBudget] = useState("25 to 50 USD");
  const [region, setRegion] = useState("United States");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function choosePhoto(file?: File) {
    setError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPG, PNG, or WebP room photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Use an image up to 5 MB.");
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit() {
    if (!photo) return setError("Upload a room photo first.");
    if (!consent) return setError("Please confirm the privacy notice first.");
    setLoading(true);
    setError("");

    try {
      const cleanedPhoto = await prepareRoomImage(photo);
      const formData = new FormData();
      formData.append("photo", cleanedPhoto);
      formData.append("spaceType", spaceType);
      formData.append("aesthetic", aesthetic);
      formData.append("budget", budget);
      formData.append("region", region);
      formData.append("consent", "yes");

      const response = await fetch("/api/room-glow-up", { method: "POST", body: formData });
      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(result.error || "Could not analyze this room.");
      if (!result.url) throw new Error("The room analysis finished, but no result page was returned.");
      window.location.href = result.url;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not analyze this room.";
      setError(message === "Failed to fetch"
        ? "The upload request was blocked or disconnected. Try a smaller image, refresh the page, or test with VPN/mobile data."
        : message);
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-berry">AI room inspiration</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Room Glow Up</h1>
        <p className="mt-4 leading-8 text-ink/70">
          Upload a room photo and get cozy, kawaii, nostalgic, or retro gaming styling ideas matched with real Forever Memory picks.
        </p>
        <div className="mt-6 rounded-lg border border-pink-100 bg-pink-50 p-4 text-sm leading-6 text-ink/75">
          {privacyNotice}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-pink-100 p-4">
          <input id="room-consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-5 w-5 accent-pink-600" />
          <label htmlFor="room-consent" className="text-sm font-semibold leading-6 text-ink/75">
            I understand this privacy notice and have permission to upload this indoor space photo.
          </label>
        </div>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-soft">
        <div className="grid gap-4">
          <label className="grid min-h-64 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-pink-200 bg-pink-50 text-center">
            {preview ? (
              <span className="h-full w-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${preview})` }} />
            ) : (
              <span className="grid gap-3 p-8 text-ink/70">
                <Camera className="mx-auto text-berry" size={34} />
                <strong>Upload room photo</strong>
                <span className="text-sm">JPG, PNG, or WebP up to 5 MB</span>
              </span>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => choosePhoto(event.target.files?.[0])} />
          </label>
          {preview && (
            <button type="button" onClick={() => { setPhoto(null); setPreview(""); }} className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 px-4 py-3 text-sm font-bold">
              <Trash2 size={16} /> Remove photo
            </button>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold text-ink/80">Space type
              <select value={spaceType} onChange={(event) => setSpaceType(event.target.value)} className="rounded-lg border border-pink-100 px-4 py-3 font-normal">{spaceTypes.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">Aesthetic
              <select value={aesthetic} onChange={(event) => setAesthetic(event.target.value)} className="rounded-lg border border-pink-100 px-4 py-3 font-normal">{aestheticOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">Budget
              <select value={budget} onChange={(event) => setBudget(event.target.value)} className="rounded-lg border border-pink-100 px-4 py-3 font-normal">{budgetOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">Shopping region
              <select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-lg border border-pink-100 px-4 py-3 font-normal">{regionOptions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
          <button type="button" onClick={submit} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-berry px-6 py-4 font-bold text-white disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Analyzing your room..." : "Analyze my room"}
          </button>
        </div>
      </div>
    </section>
  );
}
