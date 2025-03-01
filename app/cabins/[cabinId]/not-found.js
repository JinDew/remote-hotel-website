import Link from "next/link";

function NotFound() {
  return (
    <main className="mt-4 space-y-6 text-center">
      <h1 className="text-3xl font-semibold">
        This number of Cabin could not be found :(
      </h1>
      <Link
        href="/cabins"
        className="inline-block px-6 py-3 text-lg bg-accent-500 text-primary-800"
      >
        Go back to Cabin page
      </Link>
    </main>
  );
}

export default NotFound;
