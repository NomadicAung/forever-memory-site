# Room Glow Up Phase 1A

Room Glow Up lets visitors upload an indoor room photo, choose a space type, aesthetic, budget, and shopping region, then receive a structured room inspiration plan matched to real Forever Memory products.

Phase 1A uses the production flow with a mock AI provider:

- Client-side image re-encoding strips common metadata before upload.
- Server validates JPG, PNG, and WebP uploads.
- Uploaded images go to the private `room-glow-up-images` Supabase bucket when `SUPABASE_SERVICE_ROLE_KEY` is configured.
- With newer `sb_secret_...` Supabase keys, Phase 1A saves the analysis but skips private image storage because Supabase Storage still expects a legacy JWT authorization header on this endpoint. Use the legacy `service_role` JWT key if you want private image storage during Phase 1A.
- Analyses are stored with a 24-hour expiry timestamp.
- Visitors can delete the analysis and uploaded image from the result page.
- Recommendations only match against stored Forever Memory catalogue products.
- Product matches never invent prices, retailer names, reviews, or affiliate URLs.

## Environment Variables

```env
AI_PROVIDER=mock
ROOM_GLOW_UP_MAX_IMAGE_MB=5
ROOM_GLOW_UP_RATE_LIMIT_PER_HOUR=8
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
```

Keep `SUPABASE_SERVICE_ROLE_KEY` private. Do not expose it in browser code or GitHub.

## Supabase Setup

Run:

```sql
-- supabase/migrations/202608050001_room_glow_up_phase_1a.sql
```

Supabase may warn that the migration changes policies/constraints. That is expected because the analytics policy and event type constraint are updated for Room Glow Up events.

## Product Matching

For better recommendations, add matching data in `/admin`:

- Aesthetic tags: `kawaii pastel, cozy pink, pastel gamer`
- Room type tags: `bedroom, desk setup, gaming corner`
- Color tags: `pink, cream, lavender`
- Shipping regions: `United States, Worldwide`
- Availability: `active`
- Editorial priority: `0` to `10`

## Privacy Notes

Visitors are warned not to upload photos containing faces, addresses, personal documents, financial information, visible screens, or sensitive details. The app does not identify people and does not use appearance in recommendations.

The AI is instructed through validated structured output. Text visible inside images is treated as untrusted and must not be followed as instructions.

## Verification

Run:

```cmd
npm.cmd run test
npm.cmd run typecheck
npm.cmd run build
```
