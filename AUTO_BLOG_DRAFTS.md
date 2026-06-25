# Automatic Blog Draft Uploads

This project can upload AI-written articles to Supabase as unpublished drafts.

## Required private key

Add this value to `.env.local` on your computer and to the automation environment:

```env
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
```

Find it in Supabase:

1. Open your Supabase project.
2. Go to Project Settings.
3. Open API.
4. Copy the `service_role` key.

Keep this key private. Do not paste it into GitHub, public pages, or browser code.

## Upload one draft article

Create a JSON file with article content, then run:

```cmd
npm run upload:article-draft -- path\to\article.json
```

The uploader always saves articles with `status: draft`, so they will appear in the admin panel but will not go live until you publish them.

## Optional article images

If the article JSON includes local image paths, the uploader sends them to a public Supabase Storage bucket named `article-images` and uses those URLs on the draft:

```json
{
  "title": "Cute Desk Decor Ideas for a Softer Workday",
  "category": "kawaii",
  "featuredImageFile": "tmp/daily-blog/cute-desk-decor.webp",
  "pinterestImageFile": "tmp/daily-blog/cute-desk-decor-pin.webp",
  "sections": [
    {
      "heading": "Start with one soft focal point",
      "body": "A small lamp, plush figure, or pastel organizer can set the tone without making the desk feel crowded."
    }
  ]
}
```

If only `featuredImageFile` is provided, the same uploaded image is also used as the Pinterest image.
