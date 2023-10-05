import { subredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  try {
    // console.log("REACHED POST A POST");
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unathorized: You need to sign in", { status: 401 });

    const body = await req.json();
    const { subredditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        subredditId,
      },
    });
    if (!subscriptionExists) {
      return new Response("Subscribe to subreddit to be able to post!", {
        status: 400,
      });
    }
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });
    return new Response("OK");
  } catch (e) {
    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
