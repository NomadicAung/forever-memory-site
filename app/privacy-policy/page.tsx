import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Privacy Policy", description: "Forever Memory privacy policy.", path: "/privacy-policy" });

export default function PrivacyPolicyPage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-black">Privacy Policy</h1>
      <p className="mt-5 leading-8 text-ink/70">
        Forever Memory may collect basic analytics, contact form submissions, and newsletter signup information. Use
        privacy-focused analytics and store only the information needed to operate the site.
      </p>
      <p className="mt-4 leading-8 text-ink/70">
        This starter policy should be reviewed by a qualified professional before launch, especially after adding
        analytics, ads, affiliate platforms, email software, or user accounts.
      </p>
    </main>
  );
}
