import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Sectors } from "./pages/Sectors.jsx";
import { SectorPage } from "./pages/SectorPage.jsx";
import { Events } from "./pages/Events.jsx";
import { EventDetail } from "./pages/EventDetail.jsx";
import { Gallery } from "./pages/Gallery.jsx";
import { Contact } from "./pages/Contact.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export function App() {
  return (
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
  );
}
