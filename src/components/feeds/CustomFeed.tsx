import { stuff } from "@/constants/constants";
import { db } from "@/lib/db";
import { FC } from "react";
import PostFeed from "../Post/PostFeed";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";

const CustomFeed = async ({}) => {
  // console.log("CUSTOM FEED");
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

  if (!subscribedSubs.length)
    return (
      <div className="bg-lightWhite col-span-2 flex flex-col justify-center items-center">
        <h3 className="font-bold text-center">{stuff.noPosts}</h3>
        <p>{stuff.emptyHomeLine}</p>
        {/* <p className="p-5">Much Empty</p> */}
      </div>
    );

  return <PostFeed initialPosts={posts} userId={session.user.id} />;
};

export default CustomFeed;
