import { stuff } from "@/constants/constants";
import { db } from "@/lib/db";
import { FC } from "react";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";

const CustomFeed = async ({}) => {
  const session = await getAuthSession();

  if(!session?.user) return <></>;

  const subscribedSubs = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      Subreddit: true
    }
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: subscribedSubs.map(sub => sub.id);
        }
      }
    }
  })

  // return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
