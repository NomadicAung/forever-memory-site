# DigitalOcean App Platform Setup

This project must be deployed as a **Web Service**, not a Static Site. The admin login, Supabase writes, and image-upload endpoints require a running Next.js server.

## Before You Start

You need:

- A GitHub account
- A DigitalOcean account with billing enabled
- A configured Supabase project
- Access to the DNS settings for `forevermemory.xyz`

Keep `.env.local` on your computer. Never upload it to GitHub.

## 1. Confirm the Site Works Locally

Open PowerShell in the project folder and run:

```powershell
npm.cmd run build
```

The build should finish successfully before deployment.

## 2. Put the Project on GitHub

The easiest option on Windows is GitHub Desktop:

1. Install and open GitHub Desktop.
2. Choose **File > Add Local Repository**.
3. Select the `forever-memory-site` folder.
4. If prompted, choose **Create a Repository**.
5. Name it `forever-memory-site`.
6. Keep the repository private if preferred.
7. Commit the files with a message such as `Initial Forever Memory website`.
8. Click **Publish repository**.

Before publishing, confirm `.env.local`, `node_modules`, and `.next` are not in the changed-files list. The included `.gitignore` excludes them.

## 3. Create the DigitalOcean App

1. Sign in to the DigitalOcean dashboard.
2. Click **Create** and choose **App Platform** or **Apps**.
3. Choose **GitHub** as the source provider.
4. Authorize DigitalOcean to access GitHub if requested.
5. Select the `forever-memory-site` repository.
6. Select the production branch, normally `main`.
7. Enable automatic deployment when the branch changes.
8. Continue to resource configuration.

If DigitalOcean detects a Static Site, change the resource type to **Web Service**.

## 4. Configure the Web Service

Use these settings:

```text
Resource type: Web Service
Source directory: /
Build command: npm run build
Run command: npm run start
HTTP port: use the platform-provided PORT value
```

The project declares Node.js 20.9 or newer in `package.json`.

Choose a data-center region reasonably close to the intended audience and, where practical, close to the Supabase project region.

Start with the smallest paid Web Service plan suitable for a Next.js server. It can be resized later from the app settings.

## 5. Add Environment Variables

In the app setup screen, open **Environment Variables** and add:

```env
NEXT_PUBLIC_SITE_URL=https://forevermemory.xyz
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-PUBLISHABLE-OR-ANON-KEY
```

Important:

- Enter only the values, without quotation marks.
- Do not add the Supabase service-role key.
- The Supabase publishable/anon key is correct for this site because database writes are protected by user sessions and row-level security.
- Apply the variables to the production app component.

## 6. Deploy

1. Review the app configuration and monthly estimate.
2. Choose an app name such as `forever-memory`.
3. Click **Create Resources** or **Deploy**.
4. Wait for the build and deployment to complete.
5. Open the temporary DigitalOcean URL shown by App Platform.

Test these locations on the temporary URL:

```text
/
/admin/login
/blog
/sitemap.xml
/robots.txt
```

If deployment fails, open **Runtime Logs** or **Build Logs** in the DigitalOcean app. Common causes are a missing environment variable or a repository source-directory mismatch.

## 7. Connect forevermemory.xyz

1. Open the deployed app in DigitalOcean.
2. Open **Settings** and find **Domains**.
3. Choose **Add Domain**.
4. Enter `forevermemory.xyz`.
5. Add `www.forevermemory.xyz` as well if you want the `www` address.
6. DigitalOcean will display the DNS records required for this specific app.

At the company where the domain's DNS is managed, create exactly the records DigitalOcean displays. Do not copy example IP addresses from another guide.

For the root domain, DigitalOcean may request A/ALIAS records or nameserver management. For `www`, it commonly requests a CNAME. Use the values shown in your app dashboard.

DNS changes can take time to propagate. DigitalOcean will provision HTTPS automatically after the records are verified.

Choose one primary address:

- `https://forevermemory.xyz` as the primary domain
- Redirect `https://www.forevermemory.xyz` to the primary domain

## 8. Update Supabase URL Settings

In Supabase:

1. Open **Authentication**.
2. Open **URL Configuration**.
3. Set the Site URL to `https://forevermemory.xyz`.
4. Add `https://forevermemory.xyz/**` to allowed redirect URLs if the dashboard requests redirect entries.

The current password login does not depend on OAuth redirects, but setting the production URL prepares the project for password recovery and future authentication features.

## 9. Final Launch Test

Verify:

1. The homepage opens over HTTPS.
2. `/admin` redirects to the login page when signed out.
3. The admin account can sign in.
4. A draft product saves but does not appear publicly.
5. A published product appears on the appropriate category page.
6. A product image uploads successfully.
7. Affiliate buttons open the correct destination in a new tab.
8. `https://forevermemory.xyz/sitemap.xml` loads.
9. Mobile navigation and page layouts work correctly.

## 10. Future Updates

With automatic deployment enabled:

1. Make and test changes locally.
2. Commit and push them to the selected GitHub branch.
3. DigitalOcean automatically builds and deploys the update.

Database content added through `/admin` is stored in Supabase and is not erased by deployments.

