/**
 * Per-page document title and description.
 *
 * React 19 hoists <title> and <meta> rendered anywhere in the tree into
 * <head>, and removes them again on unmount — so no helmet library is needed
 * and navigating away restores the defaults from index.html.
 */
export function PageMeta({ title, description }) {
  return (
    <>
      <title>{`${title} — DG Events`}</title>
      <meta name="description" content={description} />
    </>
  );
}
