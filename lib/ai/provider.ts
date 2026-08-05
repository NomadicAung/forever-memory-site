import type { RoomGlowUpAnalysis } from "@/lib/types";
import { analyzeRoomWithMock } from "./mock-provider";
import { validateAnalysis } from "@/lib/room-glow-up/validation";

export async function analyzeRoom(input: { imageUrl?: string; spaceType: string; aesthetic: string; budget: string; region: string }): Promise<RoomGlowUpAnalysis> {
  const provider = process.env.AI_PROVIDER || "mock";

  if (provider !== "mock") {
    // Phase 1A keeps a mock provider in production shape. Real image AI can plug in here without changing callers.
    const raw = await analyzeRoomWithMock(input);
    return validateAnalysis(raw, input);
  }

  const raw = await analyzeRoomWithMock(input);
  return validateAnalysis(raw, input);
}
