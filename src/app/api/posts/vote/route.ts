import { db } from "@/lib/db";
import { voteType } from "@prisma/client";
import { NextApiRequest } from "next";

export async function PATCH(req: Request) {
  const url = new URL(req.url as string);
  const params = new URLSearchParams(url.searchParams);
  console.log("HIT VOTE ENDPOINT", url);
  const postid = params.get("postid") as string;
  const userid = params.get("userid") as string;
  const votetype = params.get("votetype") as voteType;

  // console.log(postid, userid, votetype);

  const foundVote = await db.vote.findFirst({
    where: {
      userId: userid,
      postId: postid,
    },
  });

  // console.log("FOUND VOTE", foundVote);

  //if not found Vote, create vote
  if (!foundVote) {
    const data = await db.vote.create({
      data: {
        userId: userid,
        postId: postid,
        type: votetype as voteType,
      },
    });
    // console.log(data);
    return new Response("NOT FOUND VOTE, CREATED IT: " + JSON.stringify(data), {
      status: 200,
    });
  }

  //if foundVote has same type as now, delete it
  try {
    if (foundVote?.type === votetype) {
      const data = await db.vote.deleteMany({
        where: {
          userId: userid,
          postId: postid,
        },
      });
      // console.log(data);
      return new Response("DELETED VOTE: " + JSON.stringify(data), {
        status: 200,
      });
    } else {
      const data = await db.vote.deleteMany({
        where: {
          userId: userid,
          postId: postid,
        },
      });
      //foundVote has different type than voteType
      const data2 = await db.vote.create({
        //@ts-ignore
        data: {
          userId: userid,
          postId: postid,
          type: votetype as voteType,
        },
      });
      return new Response("UPDATED VOTE DONE: ", { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return new Response("ERROR !!", { status: 500 });
  }
}
