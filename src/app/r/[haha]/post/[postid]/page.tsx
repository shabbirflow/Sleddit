import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import EditorOutput from "@/components/Editor/EditorOutput";
import { db } from "@/lib/db";
import { Heading2, Link, User2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { formatTimeToNow } from "@/lib/utils";
import { FC, Suspense } from "react";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import PostVoteClient from "@/components/post-vote/PostVoteClient";
import { voteType } from "@prisma/client";
import CommentsSection from "@/components/comments/CommentsSection";

interface pageProps {
  params: {
    haha: string;
    postid: string;
  };
}

const page = async ({ params }: pageProps) => {
  const { haha, postid } = params;
  const session = await getAuthSession();
  const post = await db.post.findFirst({
    where: { id: postid },
    include: { author: true, votes: true },
  });
  if (!post) return notFound();

  let _voteAmt: number = 0;
  let _currentVote: voteType | undefined | null = undefined;

  _voteAmt = post.votes.reduce((acc, curr) => {
    if (curr.type === "UP") return (acc += 1);
    if (curr.type === "DOWN") return (acc -= 1);
    return acc;
  }, 0);

  _currentVote = post.votes.find((vote) => {
    vote.userId === session?.user.id;
  })?.type;

  const getDataFunc = async () => {
    return await db.post.findUnique({
      where: {
        id: postid,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  };

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={_currentVote}
          initialVotesAmt={_voteAmt}
          userid={session?.user.id}
        />
        <div className="sm:w-0 w-full flex-1">
          <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username}{" "}
            {formatTimeToNow(new Date(post?.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title}
          </h1>

          <EditorOutput content={post?.content} />
          </div>

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}
