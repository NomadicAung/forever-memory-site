"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteRoomGlowUpButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteAnalysis() {
    if (!window.confirm("Delete this Room Glow Up analysis and uploaded image?")) return;
    setDeleting(true);
    await fetch(`/api/room-glow-up/${encodeURIComponent(id)}/delete`, { method: "POST" });
    window.location.href = "/room-glow-up";
  }

  return (
    <button type="button" onClick={deleteAnalysis} disabled={deleting} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-60">
      <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete analysis"}
    </button>
  );
}
