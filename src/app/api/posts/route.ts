import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest) {
  // console.log("REACHED ME");
  const url = new URL(req.url as string);
  const params = new URLSearchParams(url.search);
  // console.log(params);
  const limit = parseInt(params.get("limit") as string);
  const page = parseInt(params.get("page") as string);
  const subredditName = params.get("subredditName");

  if (!subredditName) {
    //get total Rows in table
    const totalRows = await db.post.count();

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

    if (!totalRows) return new Response("No posts yet", { status: 404 });

    return new Response(JSON.stringify(data), { status: 200 });
  }

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
      createdAt: "desc", // Sorting by 'createdAt' in descending order for latest to earliest
    },
  });


  return new Response(JSON.stringify(data), { status: 200 });
}
