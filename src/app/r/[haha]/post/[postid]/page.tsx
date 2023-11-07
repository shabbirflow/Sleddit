import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import EditorOutput from "@/components/EditorOutput";
import { db } from "@/lib/db";
import { Heading2, User2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { formatTimeToNow } from "@/lib/utils";
import { FC } from "react";

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
    include: { author: true },
  });
  if (!post) return notFound();

  return (
    <div className="flex flex-col gap-3 bg-lightWhite shadow-lg rounded-lg min-w-fit">
      <div className="w-full flex justify-between align-middle ">
        <div>
          <User2Icon />

          <div className="flex items-center justify-between w-full ">
            <h2 className="text-lg font-semibold text-gray-900 -mt-1">
              {post.author.name}{" "}
            </h2>
            <small className="text-sm text-gray-700 m-2">
              {formatTimeToNow(new Date(post.createdAt))}
            </small>
          </div>
          <p className="text-gray-700">u/{post.author.username}</p>
        </div>
      </div>
      <div className="flex flex-col align-middle justify-start gap-3">
        <EditorOutput content={post.content} />
      </div>
      <div className="mt-4 flex items-center">
        <div className="flex text-gray-700 text-sm mr-3">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-1"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>12</span>
        </div>
        <div className="flex text-gray-700 text-sm mr-8">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-1"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <span>8</span>
        </div>
        <div className="flex text-gray-700 text-sm mr-4">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 mr-1"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <span>share</span>
        </div>
      </div>
    </div>
  );
};

export default page;

<div className="bg-gray-100 min-h-screen flex items-center justify-center">
  <div className="w-full max-w-xl bg-white shadow-md rounded-md p-4">
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold">Sample Reddit Post Title</h1>
      <p className="text-gray-600">
        Posted by <span className="font-semibold">Username</span> 2 hours ago
      </p>
    </div>

    <div className="mb-4">
      <p className="text-lg">
        This is the content of the Reddit post. It can contain text, images, or
        other media.
      </p>
    </div>

    <div className="flex justify-between items-center border-t border-gray-300 pt-2">
      <div className="flex items-center space-x-2">
        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 focus:outline-none">
          Upvote
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
          Downvote
        </button>
      </div>
      <div className="text-gray-600">Comments: 10</div>
    </div>

    <div className="mt-4 space-y-4">
      <div className="bg-white shadow-md p-4 rounded">
        <div className="font-semibold">Commenter1</div>
        <div>This is a comment on the post.</div>
      </div>
      <div className="bg-white shadow-md p-4 rounded">
        <div className="font-semibold">Commenter2</div>
        <div>Another comment on the post.</div>
      </div>
      {/* More comments can go here */}
    </div>
  </div>
</div>;
