# Room Glow Up Phase 1B

Room Glow Up lets visitors upload an indoor room photo, choose a space type, aesthetic, budget, and shopping region, then receive a structured room inspiration plan matched to real Forever Memory products.

Phase 1B supports both curated mock recommendations and optional real OpenAI vision analysis:

- Client-side image re-encoding strips common metadata before upload.
- Server validates JPG, PNG, and WebP uploads.
- With `AI_PROVIDER=mock`, the app creates three curated recommendations from the visitor's selected room type, aesthetic, and budget. This mode does not inspect the uploaded image and has no AI cost.
- With `AI_PROVIDER=openai`, the server sends the compressed room image to OpenAI's Responses API for structured room analysis.
- Uploaded images go to the private `room-glow-up-images` Supabase bucket when `SUPABASE_SERVICE_ROLE_KEY` is configured.
- With newer `sb_secret_...` Supabase keys, the app saves the analysis but skips private image storage because Supabase Storage still expects a legacy JWT authorization header on this endpoint. Use the legacy `service_role` JWT key if you want private image storage.
- Analyses are stored with a 24-hour expiry timestamp.
- Visitors can delete the analysis and uploaded image from the result page.
- Recommendations only match against stored Forever Memory catalogue products.
- Product matches never invent prices, retailer names, reviews, or affiliate URLs.

## Environment Variables

```env
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_ROOM_GLOW_UP_MODEL=gpt-5.6-luna
OPENAI_ROOM_GLOW_UP_IMAGE_DETAIL=low
ROOM_GLOW_UP_MAX_IMAGE_MB=5
ROOM_GLOW_UP_RATE_LIMIT_PER_HOUR=8
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
```

Keep `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` private. Do not expose them in browser code or GitHub.

To test real AI locally, set:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
```

To go live on DigitalOcean, add the same variables under both Build Time and Runtime, then redeploy.

To pause real AI and use the curated no-cost system, set:

```env
AI_PROVIDER=mock
```

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
