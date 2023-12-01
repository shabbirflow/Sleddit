"use client";
import { FC } from "react";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId }) => {
  const [input, setinput] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ postId, text }: CommentRequest) => {
      const payload: CommentRequest = { postId, text };

      const { data } = await axios.post("/api/subreddit/post/comment", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast({
            title: "Unauthorized Action",
            description: "Please log in",
            variant: "destructive",
          });
        }
        toast({
          title: "There was an error",
          description: "Could not comment on this post",
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Comment Posted!",
      });
      setinput("");
      router.refresh();
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment" className="m-0 p-0"> Your Comment </Label>
      <div>
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="flex mt-2 justify-end">
          <Button
            isLoading={isLoading}
            disabled={!input || input?.length === 0}
            onClick={() => {
              mutate({ postId, text: input as string });
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
