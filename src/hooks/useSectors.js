import { useEffect, useState } from "react";
import { fetchSectors } from "../lib/sectors.js";
import { decorateSector } from "../lib/sectorTheme.js";

/**
 * The four sectors, already merged with their presentation tokens and in
 * progression order.
 *
 * Returns { status, sectors, error } where status is "loading" | "ready" |
 * "error". An empty `sectors` array on "ready" is the empty state — a real
 * possibility if the CMS is wiped, and callers are expected to handle it.
 */
export function useSectors() {
  const [state, setState] = useState({
    status: "loading",
    sectors: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchSectors()
      .then((sectors) => {
        if (cancelled) return;
        setState({
          status: "ready",
          sectors: (sectors ?? []).map(decorateSector),
          error: null,
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ status: "error", sectors: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * A single sector by slug, plus the others for cross-navigation.
 *
 * `sector` is undefined until status is "ready", so a missing slug is only a
 * genuine 404 once loading has finished.
 */
export function useSector(slug) {
  const { status, sectors, error } = useSectors();

  return {
    status,
    error,
    sector: sectors.find((candidate) => candidate.slug === slug),
    others: sectors.filter((candidate) => candidate.slug !== slug),
  };
}
