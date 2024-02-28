"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TextArea from "react-textarea-autosize";
import type EditorJsType from "@editorjs/editorjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

import { createPostValidator, CreatePostValidatorType } from "@/lib/validators";
import { Button } from "./ui/Button";
import ErrorAlert from "./ErrorAlert";
import { uploadFiles } from "@/lib/uploadthing";
import useToast from "@/hooks/use-toast";
import Icons from "./Icons";

const Editor = ({ subredditId }: { subredditId: string }) => {
  const editorRef = useRef<EditorJsType>();
  const titleRef = useRef<HTMLTextAreaElement>();

  const [isPageMounted, setIsPageMounted] = useState<boolean>(false);

  const { loginErrToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreatePostValidatorType>({
    resolver: zodResolver(createPostValidator),
    defaultValues: {
      title: "",
      content: {},
      subredditId,
    },
  });

  const initializeEditor = useCallback(async () => {
    const Editor = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Code = (await import("@editorjs/code")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Image = (await import("@editorjs/image")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const List = (await import("@editorjs/list")).default;
    const Table = (await import("@editorjs/table")).default;

    if (!editorRef.current) {
      const editor = new Editor({
        holder: "editor",
        onReady() {
          editorRef.current = editor;
        },
        placeholder: "Type here to write your post",
        autofocus: false,
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linktool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          embed: Embed,
          code: Code,
          list: List,
          table: Table,
          inlineCode: InlineCode,
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  console.log(res);
                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPageMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => titleRef.current?.focus(), 0);
    };
    if (isPageMounted) {
      init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isPageMounted]);

  const { ref: textareaRef, ...rest } = register("title");

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async (payload: CreatePostValidatorType) => {
      const res = await axios.post(`/api/post`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) return res.data;
      else throw new Error();
    },
    onError: (err) => {
      // if its request error
      // Unauthorized error
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      if (err instanceof axios.AxiosError && err.response?.status === 409)
        return toast.error("Error", {
          description: "There is a post with this title",
        });

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Something went wrong, please try again",
      });
    },
    onSuccess: async () => {
      const splitedPath = pathname.split("/");
      splitedPath.pop();

      const path = splitedPath.join("/");

      router.push(path);
      router.refresh();

      toast.success("Success", {
        description: "Your post published",
        icon: "🥳",
      });
    },
  });

  const onSubmit = async (data: CreatePostValidatorType) => {
    const editorContent = await editorRef.current?.save();

    const payload: CreatePostValidatorType = {
      title: data.title,
      subredditId,
      content: editorContent,
    };

    createPost(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full overflow-hidden">
      <div className="bg-zinc-50 border flex flex-col items-center gap-5 overflow-hidden border-zinc-200 w-full rounded-md p-7 mb-3">
        <div>
          {errors.title && errors.title.message ? (
            <ErrorAlert text={errors.title.message} className="mb-3" />
          ) : null}
          <TextArea
            ref={(e) => {
              textareaRef(e);
              // @ts-ignore
              titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full font-bold text-6xl border-none outline-none bg-transparent resize-none appearance-none overflow-hidden"
          />
        </div>
        <div className="w-full min-h-[500px]" id="editor" />
      </div>
      <div className="flex gap-2 w-full">
        <Button
          className="w-full"
          onClick={() => router.back()}
          variant="subtle"
          isLoading={isLoading}
        >
          <Icons.arrowLeft className="w-4" /> Back
        </Button>
        <Button className="w-full" isLoading={isLoading}>
          {" "}
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Editor;
