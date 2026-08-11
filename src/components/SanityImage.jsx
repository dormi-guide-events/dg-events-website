import { urlFor } from "../lib/sanity.js";

// Ghanaian mobile data is a real cost, so nothing here is decorative:
// - auto("format") serves WebP (or AVIF) to browsers that accept it and the
//   original format to those that do not, so old handsets still get an image.
// - a srcset of real widths means a phone downloads a phone-sized file.
// - the LQIP blur sits behind the image as a background, so a slow connection
//   shows the right colours immediately instead of a white hole.
// - width and height reserve the space, so nothing jumps as images land.
const DEFAULT_WIDTHS = [320, 480, 640, 960, 1280];
const QUALITY = 72;

export function SanityImage({
  image,
  className = "",
  sizes = "100vw",
  widths = DEFAULT_WIDTHS,
  loading = "lazy",
}) {
  if (!image?.asset) return null;

  const build = (width) =>
    urlFor(image).width(width).auto("format").quality(QUALITY).fit("max").url();

  const { width, height } = image.dimensions || {};

  return (
    <img
      src={build(widths[widths.length - 1])}
      srcSet={widths.map((w) => `${build(w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={image.alt || ""}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      style={
        image.lqip
          ? {
              backgroundImage: `url(${image.lqip})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    />
  );
}
