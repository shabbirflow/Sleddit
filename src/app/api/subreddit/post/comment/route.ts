import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";

export async function POST(req: Request) {
  console.log("HIT IT");
  try {
    const body = await req.json();
    const { postId, text } = CommentValidator.parse(body);
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
      },
    });

    return new Response("Successful comment", { status: 200 });
    
  } catch (e) {
    console.log(e);
    return new Response(
      "Could not post your comment at this time. Please try later",
      { status: 500 }
    );
  }
}
