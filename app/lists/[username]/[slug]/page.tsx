import type { Metadata } from "next";
import { SharedFavoriteList } from "@/components/lists/SharedFavoriteList";

type PageProps = { params: Promise<{ username: string; slug: string }> };

function listParams({ username, slug }: { username: string; slug: string }) {
  return { username: username.toLowerCase(), slug: slug.toLowerCase() };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, slug } = listParams(await params);
  return {
    title: `${slug} · @${username}`,
    robots: { index: false, follow: false },
  };
}

export default async function FavoriteListPage({ params }: PageProps) {
  const { username, slug } = listParams(await params);
  return <SharedFavoriteList username={username} slug={slug} />;
}
