import { stuff } from "@/constants/constants";
import { db } from "@/lib/db";
import { FC } from "react";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";

const CustomFeed = async ({}) => {
  console.log("CUSTOM FEED");
  const session = await getAuthSession();

  if (!session?.user) return <></>;

  const subscribedSubs = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      Subreddit: true,
    },
  });

  // console.log(subscribedSubs.map((sub) => sub.Subreddit.name));

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: subscribedSubs.map((sub) => sub.Subreddit.name),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: parseInt(stuff.INF_SCROLLING_PAGINATION_AMOUNT),
    include: {
      votes: true,
      subreddit: true,
      comments: true,
      author: true,
    },
  });

  // console.log(
  //   "CUSTOM FEED",
  //   posts.map((post) => post.subreddit.name)
  // );

  // console.log(posts);

  return (
      <PostFeed initialPosts={posts} userId = {session.user.id}/>
  );
};

export default CustomFeed;
