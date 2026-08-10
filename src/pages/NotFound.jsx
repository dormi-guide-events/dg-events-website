import { PageMeta } from "../components/PageMeta.jsx";

export function NotFound() {
  return (
    <>
      <PageMeta
        title="Page not found"
        description="The page you were looking for is not here. Browse our four sectors and upcoming events instead."
      />
      <h1 className="px-4 py-24 text-center text-3xl text-purple-700 md:text-4xl">
        Page not found
      </h1>
    </>
  );
}
