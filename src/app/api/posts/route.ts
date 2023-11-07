import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  // console.log("REACHED ME");
  const url = new URL(req.url as string);
  const params = new URLSearchParams(url.search);
  // console.log(params);
  const limit = parseInt(params.get("limit") as string);
  const page = parseInt(params.get("page") as string);
  const userId = params.get("userId");
  const subredditName = params.get("subredditName");

  if (!subredditName && !userId) {
    return getRandomPosts(page, limit);
  }

  if (subredditName) {
    return getSubredditPosts(page, limit, subredditName);
  }

  if (userId) {
    return getUserSubPosts(page, limit, userId)
  }

  return new Response(JSON.stringify("NOT FOUND"), { status: 404 });
}

const getRandomPosts = async (page: number, limit: number) => {
  //no subreddit & no id
  //get total Rows in table
  const totalRows = await db.post.count();
  if (!totalRows) return new Response("No posts yet", { status: 404 });

  const data = await db.post.findMany({
    //NO WHERE CLAUSE FOR SUBREDDIT
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    skip: ((page - 1) * limit) % totalRows,
    take: limit,
    orderBy: {
      createdAt: "desc", // Sorting by 'createdAt' in descending order for latest to earliest
    },
  });

  // console.log("RANDOM: ", data)

  return new Response(JSON.stringify(data), { status: 200 });
};

const getSubredditPosts = async (
  page: number,
  limit: number,
  subredditName: string
) => {
  //get total Rows in table
  const totalRows = await db.post.count({
    where: {
      subreddit: {
        name: subredditName as string,
      },
    },
  });

  if (!totalRows) return new Response("No posts yet", { status: 404 });

  // console.log(limit, page, subredditName);
  const data = await db.post.findMany({
    where: {
      subreddit: {
        name: subredditName as string,
      },
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    skip: ((page - 1) * limit) % totalRows,
    take: limit,
    orderBy: {
      createdAt: "desc",
      // Sorting by 'createdAt' in descending order for latest to earliest
    },
  });

  return new Response(JSON.stringify(data), { status: 200 });
};

const getUserSubPosts = async (page: number, limit: number, userId: string) => {
  const followedCommunities = await db.subscription.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });
  //get total Rows in table
  const totalRows = await db.post.count({
    where: {
      subreddit: {
        id: {
          in: followedCommunities.map((comm) => comm.subredditId),
        },
      },
    },
  });

  if (!totalRows) return new Response("No posts yet", { status: 404 });

  // console.log(limit, page, subredditName);
  const data = await db.post.findMany({
    where: {
      subreddit: {
        id: {
          in: followedCommunities.map((comm) => comm.subredditId),
        },
      },
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    skip: ((page - 1) * limit) % totalRows,
    take: limit,
    orderBy: {
      createdAt: "desc", // Sorting by 'createdAt' in descending order for latest to earliest
    },
  });

  // console.log("I WAS RIGHT", data);

  return new Response(JSON.stringify(data), { status: 200 });
};
