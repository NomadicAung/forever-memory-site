# Supabase Setup

Forever Memory works with demo content until these steps are complete.

## 1. Create the project

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor** in the new project.
3. Open `supabase/migrations/202606200001_initial.sql` from this project.
4. Copy the full SQL file into Supabase SQL Editor and click **Run**.

This creates the content tables, security policies, three categories, and the public `product-images` storage bucket.

## 2. Create the first admin

1. In Supabase, open **Authentication > Users**.
2. Click **Add user**, choose **Create new user**, and enter the admin email and password.
3. Copy the new user's UUID.
4. Open SQL Editor and run this after replacing the sample values:

```sql
insert into public.profiles (id, email, role)
values ('PASTE-USER-UUID-HERE', 'your-email@example.com', 'admin');
```

Do not expose the password or a Supabase service-role key in the website.

## 3. Connect the website

1. In Supabase, open **Project Settings > API**.
2. Copy the **Project URL** and **anon public key**.
3. Create `.env.local` beside `package.json`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

4. Restart the development server with `npm.cmd run dev`.
5. Open http://localhost:3000/admin and sign in.

## 4. Publish content

- Leave **Publish immediately** unchecked to save a draft visible only in admin.
- Check it to publish the product or article on the public site.
- Product images can be uploaded directly to Supabase Storage from the product form.
- JSON export remains available as an extra backup.

## 5. Vercel

Add the same three environment variables in **Vercel > Project Settings > Environment Variables**, using `https://forevermemory.xyz` for `NEXT_PUBLIC_SITE_URL`, then redeploy.

