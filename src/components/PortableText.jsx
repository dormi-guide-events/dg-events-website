import { PortableText as PortableTextRenderer } from "@portabletext/react";

// Rich text is rendered to React elements, never through
// dangerouslySetInnerHTML — so CMS content cannot inject markup.
//
// Link hrefs still need checking: an editor can paste anything into the link
// field, and "javascript:…" in an href executes on click. Only these schemes
// are let through.
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/|#)/i;

function safeHref(href) {
  if (typeof href !== "string") return null;
  const trimmed = href.trim();
  return SAFE_HREF.test(trimmed) ? trimmed : null;
}

const components = {
  block: {
    normal: ({ children }) => (
      <p className="mt-5 text-base leading-relaxed text-charcoal first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-serif text-2xl text-purple-900 first:mt-0 md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-serif text-xl text-purple-900 first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-pink-500 pl-5 font-serif text-lg leading-relaxed text-purple-900 italic">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-2.5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2.5 pl-5 marker:text-purple-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 text-base leading-relaxed text-charcoal">
        <span
          aria-hidden="true"
          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-pink-500"
        />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-base leading-relaxed text-charcoal">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-purple-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-pink-100 px-1.5 py-0.5 text-sm text-purple-900">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = safeHref(value?.href);
      // A link we cannot vouch for still shows its text, just not as a link.
      if (!href) return <>{children}</>;

      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="rounded-sm text-purple-700 underline decoration-pink-500 underline-offset-4 transition-colors hover:text-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableText({ value }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableTextRenderer value={value} components={components} />;
}
