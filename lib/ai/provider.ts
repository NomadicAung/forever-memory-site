import type { RoomGlowUpAnalysis } from "@/lib/types";
import { analyzeRoomWithMock } from "./mock-provider";
import { analyzeRoomWithOpenAI } from "./openai-provider";
import { validateAnalysis } from "@/lib/room-glow-up/validation";

export async function analyzeRoom(input: { imageDataUrl?: string; imageUrl?: string; spaceType: string; aesthetic: string; budget: string; region: string }): Promise<RoomGlowUpAnalysis> {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();

  if (provider === "openai") {
    const raw = await analyzeRoomWithOpenAI(input);
    return validateAnalysis(raw, input);
  }

  const raw = await analyzeRoomWithMock(input);
  return validateAnalysis(raw, input);
}
