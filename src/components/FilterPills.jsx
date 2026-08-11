import { Link } from "react-router-dom";

/**
 * Filters that live in the URL rather than in component state, so a filtered
 * view survives a refresh and can be pasted to someone else.
 *
 * They are links because they genuinely navigate — which also means keyboard
 * support, middle-click and browser history all work without any extra code.
 *
 * `options` are { value, label }; a null value clears the filter.
 */
export function FilterPills({ label, basePath, paramName, options, active }) {
  if (options.length === 0) return null;

  const hrefFor = (value) =>
    value ? `${basePath}?${paramName}=${encodeURIComponent(value)}` : basePath;

  return (
    <nav aria-label={label} className="mt-10">
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = (option.value ?? null) === (active ?? null);
          return (
            <li key={option.value ?? "all"}>
              <Link
                to={hrefFor(option.value)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
                  isActive
                    ? "border-purple-700 bg-purple-700 text-off-white"
                    : "border-purple-900/15 text-purple-700 hover:border-purple-700 hover:bg-pink-100",
                ].join(" ")}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
