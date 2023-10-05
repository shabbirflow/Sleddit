import { subredditValidator } from "@/lib/validators/subreddit";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession(); //get current session

    if (!session?.user) {
      //if session doesnt exist, return. session is optional
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json(); //NEXT JS WAY to say... req.body
    const { name } = subredditValidator.parse(body);

    const subredditExists = await db.subreddit.findFirst({
      where: {
        name: name,
      },
    });

    if (subredditExists) {
      return new Response("Subreddit exists", { status: 409 });
    }

    const subreddit = await db.subreddit.create({
      data: {
        name: name,
        creatorId: session.user.id,
      },
    });

    //creator subscribes to created subreddit
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    console.log(subreddit.name)
    return new Response(subreddit.name);
  } catch (e) {
    return new Response("Could not create subreddit", { status: 500 });
  }
}
