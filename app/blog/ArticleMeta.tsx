import { getPost } from "./posts";
import { SITE_URL } from "../lib/content";

/** Date/tag line + Article JSON-LD, imported at the top of each MDX post. */
export default function ArticleMeta({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "de-AT",
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { "@type": "Person", name: "Andrii Gorbenko", url: SITE_URL },
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--accent)]">
          {post.tag}
        </span>
        <span>{post.dateLabel}</span>
        <span>·</span>
        <span>{post.readingMinutes} Min. Lesezeit</span>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
