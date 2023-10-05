import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    console.log("REACHED SUBSCRIBE TO SUBREDDIT");
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unathorized", { status: 401 });

    const body = await req.json();
    const { subredditId } = subredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        subredditId
      },
    });
    if(subscriptionExists){
        return new Response("You are already subscribed to this subreddit", {status: 400})
    }
    await db.subscription.create({
        data: {subredditId, userId: session.user.id}
    })
    return new Response(subredditId)
  } catch (e) {
    return new Response("Could not subscribe to subreddit", { status: 500 });
  }
}
