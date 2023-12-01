'use client';
import { Vote, voteType } from "@prisma/client";
import { FC, useEffect } from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { usePrevious } from "@mantine/hooks";
import axios, { AxiosError } from "axios";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote: voteType | undefined;
  userid: string | undefined;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVote,
  initialVotesAmt,
  userid,
}) => {
  const [currVote, setCurrVote] = useState<voteType | undefined>(initialVote);
  const [voteAmt, setVoteAmt] = useState<number>(initialVotesAmt);
  const prevVote = usePrevious(currVote);

  useEffect(() => {
    setCurrVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (type: voteType) => {
      console.log("HIII");
      const url = `/api/posts/vote?userid=${userid}&postid=${postId}&votetype=${type}`;

      const data = await axios.patch(url);
      console.log("AFTER: ", data);
      return data;
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVoteAmt((prev) => prev - 1);
      else setVoteAmt((prev) => prev + 1);
      // console.log("ERROR AT START: ", err);

      // reset current vote
      setCurrVote(prevVote);

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: (type: voteType) => {
      if (currVote === type) {
        // User is voting the same way again, so remove their vote
        setCurrVote(undefined);
        if (type === "UP") setVoteAmt((prev) => prev - 1);
        else if (type === "DOWN") setVoteAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrVote(type);
        if (type === "UP") setVoteAmt((prev) => prev + (currVote ? 2 : 1));
        else if (type === "DOWN")
          setVoteAmt((prev) => prev - (currVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {/* upvote */}
      <Button
        disabled={isLoading}
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        {!isLoading ? (
          <ArrowBigUp
            className={cn("h-5 w-5 text-zinc-700", {
              "text-emerald-500 fill-emerald-500": currVote === "UP",
            })}
          />
        ) : (
          <Loader />
        )}
      </Button>

      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {voteAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        className={cn({
          "text-emerald-500": currVote === "DOWN",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        {!isLoading ? (
          <ArrowBigDown
            className={cn("h-5 w-5 text-zinc-700", {
              "text-red-500 fill-red-500": currVote === "DOWN",
            })}
          />
        ) : (
          <Loader />
        )}
      </Button>
    </div>
  );
};

export default PostVoteClient;
