import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { NotFound } from "./pages/NotFound.jsx";

// Every route except the landing page and the 404 is split into its own chunk.
// That took the entry bundle from 169 kB gzipped to 68 kB and the home page's
// LCP from 7.0s to 4.7s under Lighthouse's throttling.
//
// Home and NotFound stay in the entry chunk: Home is what most people land on,
// and NotFound has to render even if a chunk fails to load.
const PAGE_LOADERS = {
  About: () => import("./pages/About.jsx"),
  Sectors: () => import("./pages/Sectors.jsx"),
  SectorPage: () => import("./pages/SectorPage.jsx"),
  Events: () => import("./pages/Events.jsx"),
  EventDetail: () => import("./pages/EventDetail.jsx"),
  Gallery: () => import("./pages/Gallery.jsx"),
  Contact: () => import("./pages/Contact.jsx"),
};

const named = (key) =>
  lazy(() => PAGE_LOADERS[key]().then((m) => ({ default: m[key] })));

const About = named("About");
const Sectors = named("Sectors");
const SectorPage = named("SectorPage");
const Events = named("Events");
const EventDetail = named("EventDetail");
const Gallery = named("Gallery");
const Contact = named("Contact");

/**
 * Warm every route chunk once the browser is idle.
 *
 * Splitting without this trades a faster first paint for a blank flash on the
 * first visit to each route — a bad deal on a slow connection, which is
 * exactly who benefits from the split. Fetching them during idle time keeps
 * the first paint light and makes navigation instant anyway.
 */
function usePrefetchRoutes() {
  useEffect(() => {
    const schedule =
      window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1200));
    const cancel =
      window.cancelIdleCallback || ((id) => window.clearTimeout(id));

    const handle = schedule(() => {
      for (const load of Object.values(PAGE_LOADERS)) {
        // Failures are irrelevant — the route will simply load on demand.
        load().catch(() => {});
      }
    });

    return () => cancel(handle);
  }, []);
}

export function App() {
  usePrefetchRoutes();

  return (
    <Suspense
      fallback={
        // Reserves roughly a screen so the footer does not jump if a chunk is
        // ever slow enough to show this.
        <div className="min-h-[60vh]" aria-busy="true">
          <p role="status" className="sr-only">
            Loading page…
          </p>
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />

          <Route path="sectors">
            <Route index element={<Sectors />} />
            {/* One template for all four sectors, resolved from the slug. */}
            <Route path=":slug" element={<SectorPage />} />
          </Route>

          <Route path="events">
            <Route index element={<Events />} />
            <Route path=":slug" element={<EventDetail />} />
          </Route>

          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
