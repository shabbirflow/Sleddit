import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const results = await db.subreddit.findMany({
    where: {
      name: {
        contains: q as string,
      },
    },
    take: 5,
  });

  return new Response(JSON.stringify(results));
}
