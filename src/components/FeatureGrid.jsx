import { Reveal } from "./Reveal.jsx";

// Only two shapes are needed, and Tailwind needs both written out in full.
const columnClasses = {
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/**
 * A hairline-ruled grid of short titled statements, each led by the gradient
 * ring bullet. First used for the home page pillars; now the shared shape for
 * pillars, objectives, approaches and sector event formats.
 *
 * Items are `{ title, body }`. Set `numbered` to replace the ring bullet with
 * a running 01, 02, 03 where the order carries meaning.
 */
export function FeatureGrid({ items, columns = 4, numbered = false }) {
  return (
    <ul className={`mt-12 grid gap-x-8 gap-y-10 lg:mt-16 ${columnClasses[columns]}`}>
      {items.map((item, index) => (
        <li key={item.title}>
          <Reveal delay={index * 0.06}>
            <div className="border-t border-purple-900/10 pt-6">
              {numbered ? (
                <p className="font-serif text-2xl text-purple-700">
                  {String(index + 1).padStart(2, "0")}
                </p>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-purple-700 to-pink-500"
                >
                  <span className="h-3.5 w-3.5 rounded-full bg-off-white" />
                </span>
              )}
              <h3 className="mt-4 font-serif text-lg text-purple-900">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-grey-500">
                {item.body}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
