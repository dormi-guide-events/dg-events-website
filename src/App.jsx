import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Sectors } from "./pages/Sectors.jsx";
import { SectorStudents } from "./pages/SectorStudents.jsx";
import { SectorGraduates } from "./pages/SectorGraduates.jsx";
import { SectorWorkers } from "./pages/SectorWorkers.jsx";
import { SectorEntrepreneurs } from "./pages/SectorEntrepreneurs.jsx";
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
          <Route path="students" element={<SectorStudents />} />
          <Route path="graduates" element={<SectorGraduates />} />
          <Route path="workers" element={<SectorWorkers />} />
          <Route path="entrepreneurs" element={<SectorEntrepreneurs />} />
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
