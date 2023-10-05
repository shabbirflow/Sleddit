"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreateRequest, PostValidator } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { boolean } from "zod";
import { set } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreateRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId: subredditId,
      title: "",
      content: null,
    },
  });

  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);

  //defer loading -- display other content while your editor laods
  // editor loading is heavy
  const initializedEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      console.log("Object.keys of errors", Object.keys);
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializedEditor();
    };

    setTimeout(() => {
      _titleRef.current?.focus(); //focus title of editor after everything renders
    }, 0);

    if (isMounted) {
      init();
      return () => {
        //cleanup function
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializedEditor]);

  const { mutate } = useMutation({
    mutationFn: async ({ title, content, subredditId }: PostCreateRequest) => {
      const payload: PostCreateRequest = { title, content, subredditId };
      // console.log("REACHED MUTATION FUNCTION");

      const { data } = await axios.post("/api/subreddit/post/create", payload);

      return data;
    },
    onError: () => {
      toast({
        title: "Could not upload Post",
        description: "There was some error while uploading post",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathName = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathName);

      router.refresh();

      return toast({
        title: "Posted!",
        description: "Your post was uploaded successfully",
      });
    },
  });

  async function onSubmit(data: PostCreateRequest) {
    // console.log("REACHED ON SUBMIT");
    const blocks = await ref.current?.save();
    //save current state of editor

    const payload: PostCreateRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    };

    mutate(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");
  //using ref from register so we can access ref for title
  // as well as use register from react hook form

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            placeholder="title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none"
            ref={(e) => {
              titleRef(e); //react hook form ka ref
              //@ts-ignore
              _titleRef.current = e; //our ref
            }}
            {...rest} //pass everything else from register title
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
