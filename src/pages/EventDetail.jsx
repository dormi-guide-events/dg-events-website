import { useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta.jsx";

export function EventDetail() {
  // The real page loads this event from Sanity by slug.
  const { slug } = useParams();

  return (
    <>
      {/* TODO: once the event loads, use its title and summary here. */}
      <PageMeta
        title="Event"
        description="Details, dates and venue for an upcoming Dormi Guide Events programme in Ghana."
      />
      <h1 className="px-4 py-24 text-center text-3xl text-purple-700 md:text-4xl">
        Event: {slug}
      </h1>
    </>
  );
}
