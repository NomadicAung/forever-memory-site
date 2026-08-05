export const spaceTypes = [
  "Bedroom",
  "Desk setup",
  "Gaming corner",
  "Reading nook",
  "Plushie display",
  "Dorm room",
  "Small apartment corner",
  "Other indoor space"
] as const;

export const aestheticOptions = [
  "Kawaii Pastel",
  "Cozy Pink",
  "Soft Minimal",
  "Cute Retro",
  "Nostalgic Gaming",
  "Sweet Cottage",
  "Cozy Neutral",
  "Pastel Gamer",
  "Plushie Paradise",
  "Surprise Me"
] as const;

export const budgetOptions = [
  "Under 25 USD",
  "25 to 50 USD",
  "50 to 100 USD",
  "100 to 200 USD",
  "Flexible"
] as const;

export const regionOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Japan",
  "Singapore",
  "Worldwide"
] as const;

export const privacyNotice =
  "Upload only a room or indoor space you have permission to photograph. Avoid including faces, addresses, personal documents, financial information, computer screens, family photos, or other sensitive information.";

export function budgetMax(option: string) {
  if (option.includes("Under 25")) return 25;
  if (option.includes("25 to 50")) return 50;
  if (option.includes("50 to 100")) return 100;
  if (option.includes("100 to 200")) return 200;
  return Number.POSITIVE_INFINITY;
}
