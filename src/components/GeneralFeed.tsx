import { stuff } from "@/constants/constants";
import { db } from "@/lib/db";
import { FC } from "react";
import PostFeed from "./PostFeed";

const GeneralFeed = async ({}) => {
  console.log("GENERAL FEED");
  const posts = await db.post.findMany({
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

  return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
