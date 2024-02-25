"use client";

import { useMutation } from "@tanstack/react-query";
import TextArea from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/Button";
import axios from "axios";
import {
  createCommentValidator,
  createCommentValidatorTypes,
} from "@/lib/validators";
import useToast from "@/hooks/use-toast";
import { toast } from "sonner";
import { startTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CreateReplyComment = ({
  postId,
  username,
  closeReplay,
  replyToId,
}: {
  postId: string;
  username: string;
  closeReplay: () => void;
  replyToId: string;
}) => {
  const { loginErrToast } = useToast();
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const {
    register,
    formState: { errors },
    resetField,
    handleSubmit,
    setError,
  } = useForm<createCommentValidatorTypes>({
    resolver: zodResolver(createCommentValidator),
    defaultValues: {
      text: `@${username} `,
      postId,
      replyToId,
    },
  });

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async (data: createCommentValidatorTypes) => {
      const payload = data;

      createCommentValidator.parse(payload);

      console.log(payload.text);

      const input = payload.text.split(" ");
      console.log(input);

      // if (payload.text.length < 3) {
      //   throw new Error("EMPTY_INPUT");
      // }

      if (
        input[0].startsWith("@") &&
        input.length === 2 &&
        input[1].length < 3
      ) {
        throw new Error("EMPTY_INPUT");
      }

      const { data: resData, status } = await axios.post(
        "/api/comment",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (status === 201) return resData as string;
      else throw Error();
    },
    onError: (err: Error) => {
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      if (err.message === "EMPTY_INPUT")
        return setError("text", { message: "At least 3 characters required" });

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Something went wrong, please try again",
      });
    },
    onSuccess: () => {
      toast.success("Your comment posted");
      resetField("text");
      closeReplay();

      startTransition(() => {
        router.refresh();
      });
    },
  });

  const onSubmit = (data: createCommentValidatorTypes) => {
    createComment(data);
  };

  const { ref, ...other } = register("text");

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [textAreaRef]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col gap-2">
        <div>
          <TextArea
            className="w-full p-3 font-medium placeholder:font-normal text-sm border border-zinc-100 rounded-md outline-none bg-zinc-100 resize-none appearance-none overflow-hidden"
            minRows={3}
            {...other}
            ref={(r) => {
              ref(r);
              //   @ts-expect-error
              textAreaRef.current = r;
            }}
          />
          {errors.text && (
            <p className="text-red-500 text-xs">{errors.text?.message}</p>
          )}
        </div>
        <div className="flex justify-end items-center gap-2">
          <Button
            onClick={closeReplay}
            variant="ghost"
            className="self-end"
            type="submit"
          >
            Cancel
          </Button>
          <Button isLoading={isLoading} className="self-end" type="submit">
            Post
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateReplyComment;
