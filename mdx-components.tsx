import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="font-display mt-12 text-2xl font-bold tracking-tight sm:text-3xl"
        {...props}
      />
    ),
    h3: (props) => <h3 className="mt-8 text-lg font-semibold" {...props} />,
    p: (props) => (
      <p className="mt-5 leading-relaxed text-[var(--foreground)]/85" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 leading-relaxed text-[var(--foreground)]/85"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-[var(--foreground)]/85"
        {...props}
      />
    ),
    li: (props) => <li {...props} />,
    strong: (props) => <strong className="font-semibold text-[var(--foreground)]" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-2 border-[var(--accent)] pl-5 italic text-[var(--muted)]"
        {...props}
      />
    ),
    a: ({ href = "", ...props }) =>
      href.startsWith("/") ? (
        <Link href={href} className="text-[var(--accent)] underline underline-offset-4" {...props} />
      ) : (
        <a
          href={href}
          className="text-[var(--accent)] underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        />
      ),
    hr: () => <hr className="mt-10 border-[var(--border)]" />,
    ...components,
  };
}
