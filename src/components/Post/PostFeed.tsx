"use client";
import { ExtendedPost } from "@/types/db";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef, useState } from "react";
import Post from "./Post";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { stuff } from "@/constants/constants";
import axios from "axios";
import { Vote } from "@prisma/client";
import { Icons } from "../ui/Icons";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
  userId?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName, userId }) => {
  const lastPostRef = useRef<HTMLDivElement>(null);
  const [noPosts, setNoPosts] = useState<boolean>(false);
  // console.log(initialPosts);

  //to find out when last post is visible, ill load more posts
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"], // Query key (an array)
    async ({ pageParam = 1 }) => {
      // Query function to fetch data
      const query =
        `/api/posts?limit=${stuff.INF_SCROLLING_PAGINATION_AMOUNT}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "") +
        (!!userId ? `&userId=${userId}` : "");
      // Use !! to convert a value into a boolean (true or false)
      const { data } = await axios.get(query);
      // console.log("AXIOS QUERY DATA: ", data);
      return data as ExtendedPost[];
      // return data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        // Calculate the next page parameter based on the number of fetched pages
        const nextPageParam = allPages.length + 1;
        // console.log("NEXTPAGE PARAM: ", nextPageParam);
        return nextPageParam;
      },
      initialData: { pages: [initialPosts], pageParams: [1] }, // Initial data for the query
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts; //render initialPosts if posts does not exist

  useEffect(() => {
    // entry?.isIntersecting
    //   ? console.log("INTERSECTING")
    //   : console.log("OBSCURED");
    entry?.isIntersecting ? fetchNextPage() : false;
  }, [entry]);

  if (!initialPosts.length || noPosts)
    return (
      <div className="bg-lightWhite w-full flex flex-row justify-center align-middle items-center p-3">
        <h3 className="font-bold p-5">No posts yet...</h3>
        <Icons.bombIcon color="brown" size={24} />
        {/* <p className="p-5">Much Empty</p> */}
      </div>
    );

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, ind) => {
        // console.log(post);
        const voteAmt = post.votes.reduce((acc: number, vote: Vote) => {
          if (vote.type === "DOWN") return acc - 1;
          if (vote.type === "UP") return acc + 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote: Vote) => vote.userId === session?.user.id
        );

        if (ind === posts.length - 1) {
          return (
            <div key={ind} ref={ref}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                voteAmt={voteAmt}
                session={session}
              />
            </div>
          );
        } else
          return (
            <div key={ind}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                voteAmt={voteAmt}
                session={session}
              />
            </div>
          );
      })}
      {isFetchingNextPage ? <h6> Loading more posts...</h6> : <></>}
    </ul>
  );
};

export default PostFeed;
