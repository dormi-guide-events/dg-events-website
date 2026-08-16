/**
 * Renders a Schema.org block.
 *
 * dangerouslySetInnerHTML is unavoidable for a JSON-LD data block, but it is
 * safe here in a way that rich text would not be: the content is always
 * JSON.stringify output, never raw CMS markup, and every "<" is escaped to a
 * unicode sequence so a value containing a closing script tag cannot break out
 * of the element. The browser never executes it either — application/ld+json
 * is a data block, not a script.
 */
export function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
