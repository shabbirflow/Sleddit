import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { stuff } from "@/constants/constants";
import { db } from "@/lib/db";
import { Prisma, PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    haha: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { haha } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: { name: haha },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: { createdAt: "desc" },
        take: parseInt(stuff.INF_SCROLLING_PAGINATION_AMOUNT),
      },
    },
  });

  // console.log(subreddit);

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default page;
