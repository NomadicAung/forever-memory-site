import { notFound } from "next/navigation";
import { RoomGlowUpResults } from "@/components/RoomGlowUpResults";
import { getRoomGlowUpAnalysis } from "@/lib/room-glow-up/store";
import { metadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  metadata({
    title: "Room Glow Up Results",
    description: "Your AI room inspiration plan with curated Forever Memory product matches.",
    path: "/room-glow-up"
  });

export default async function RoomGlowUpResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getRoomGlowUpAnalysis(id);
  if (!record) notFound();
  return <RoomGlowUpResults analysis={record.analysis} matches={record.matched_products} />;
}
