"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { stuff } from "@/constants/constants";
import { FC } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createSubRedPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface pageProps {}

const Page = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: createSubRedPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists",
            description:
              "Subreddit name must be unique. Please choose another name.",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return toast({
            title: "Unauthorized Action",
            description: "Please log in to create a subreddit",
            variant: "destructive",
          });
        }
        toast({
          title: "There was an error",
          description: "Could not create subreddit",
        });
      }
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded=lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-zinc-600 h-px" />
        <p className="text-xl font-medium mb-1 h-fit ">Name</p>
        <p className="mt-1 h-fit ">{stuff.createCommunityLine}</p>

        <div className="relative">
          <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-600">
            r/
          </p>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            className="pl-6"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            className="bg-red-200"
            variant={"subtle"}
            onClick={() => {
              router.back();
            }}
          >
            {" "}
            Cancel{" "}
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={(e) => {
              mutate();
            }}
          >
            {" "}
            Create Community{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
