import { useParams } from "react-router-dom";

export function EventDetail() {
  // The real page loads this event from Sanity by slug.
  const { slug } = useParams();

  return (
    <h1 className="px-4 py-24 text-center text-3xl text-purple-700 md:text-4xl">
      Event: {slug}
    </h1>
  );
}
