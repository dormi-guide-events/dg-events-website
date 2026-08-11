import { useEffect, useState } from "react";

/**
 * The loading / ready / error dance every Sanity read needs, in one place.
 *
 * `deps` must be primitives. Passing an object or an inline function would
 * change identity on every render and refetch forever, which is why the
 * loader is a closure and the dependencies are listed separately.
 *
 * An empty result is not an error — callers inspect `data` and render their
 * own empty state, because "there is nothing here" is a design problem rather
 * than a failure.
 */
export function useAsyncData(loader, deps = []) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  // The dependency list is supplied by the caller, so the linter cannot see it
  // statically. Callers pass primitives only — see the note above.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (cancelled) return;
        setState({ status: "ready", data, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Sanity request failed:", error);
        setState({ status: "error", data: null, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
