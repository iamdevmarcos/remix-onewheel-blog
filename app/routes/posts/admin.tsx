import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPostListings } from "~/models/post.server";

type LoaderData = {
  adminPosts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ adminPosts: await getPostListings() });
};

export default function AdminRoute() {
  const { adminPosts } = useLoaderData() as LoaderData;
  console.log(adminPosts);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {adminPosts &&
              adminPosts.map((post) => (
                <li key={post.slug}>
                  <Link to={post.slug} className="text-blue-600 underline">
                    {post.title}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="text-red-500">
      Oh no, something went wrong!
      <pre>{error.message}</pre>
    </div>
  );
}
