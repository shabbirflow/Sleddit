import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
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
    if(!subscriptionExists){
        return new Response("You are already Unsubscribed from this subreddit", {status: 400})
    }

    //check if user is creator of subreddit
    const subreddit = await db.subreddit.findFirst({where: {id: subredditId, creatorId: session.user.id}});
    if(subreddit){
        return new Response("You cannot unsubscribe from your own subreddit", {status: 400})
    }

    await db.subscription.delete({
        where: {userId_subredditId: {
            subredditId, userId: session.user.id
        }}
    })
    return new Response(subredditId)
  } catch (e) {
    return new Response("Could not subscribe to subreddit", { status: 500 });
  }
}
