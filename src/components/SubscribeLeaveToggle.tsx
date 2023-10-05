"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { subRedSubscriptPayload } from "@/lib/validators/subreddit";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const router = useRouter();
  const {
    mutate: subscribeMutate,
    isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const payload: subRedSubscriptPayload = { subredditId };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "Albready subscribed",
            description:
              "Youre already subscribed to this subreddit you silly goose",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return toast({
            title: "Unauthorized Action",
            description: "Please log in to subscribe to a subreddit",
            variant: "destructive",
          });
        }
        toast({
          title: "There was an error",
          description: "Could not subscribe to subreddit",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed",
        description: `You are now subscribed to the ${subredditName} subreddit`,
      });
    },
  });
  const { mutate: unSubscribeMutate, isLoading: unSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: subRedSubscriptPayload = { subredditId };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "Albready Unsubscribed",
            description:
              "Youre already are not subscribed to this subreddit you silly goose",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return toast({
            title: "Unauthorized Action",
            description: "Please log in to unsubscribe from a subreddit",
            variant: "destructive",
          });
        }
        toast({
          title: "There was an error",
          description: "Could not unsubscribe from subreddit",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "UnSubscribed",
        description: `You are now unsubscribed from the ${subredditName} subreddit`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => {
        unSubscribeMutate();
      }}
      isLoading={unSubLoading}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => {
        subscribeMutate();
      }}
      isLoading={isLoading}
    >
      Join to Post
    </Button>
  );
};

export default SubscribeLeaveToggle;
