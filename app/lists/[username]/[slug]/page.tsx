import type { Metadata } from "next";
import { SharedFavoriteList } from "@/components/lists/SharedFavoriteList";

type PageProps = { params: Promise<{ username: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, slug } = await params;
  return {
    title: `${slug} · @${username}`,
    robots: { index: false, follow: false },
  };
}

export default async function FavoriteListPage({ params }: PageProps) {
  const { username, slug } = await params;
  return <SharedFavoriteList username={username} slug={slug} />;
}
