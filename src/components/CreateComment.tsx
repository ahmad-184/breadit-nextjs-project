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
import { startTransition } from "react";
import { useRouter } from "next/navigation";

const CreateComment = ({ postId }: { postId: string }) => {
  const { loginErrToast } = useToast();
  const router = useRouter();

  const {
    register,
    formState: { errors },
    resetField,
    handleSubmit,
  } = useForm<createCommentValidatorTypes>({
    resolver: zodResolver(createCommentValidator),
    defaultValues: {
      text: "",
      postId,
    },
  });

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async (data: createCommentValidatorTypes) => {
      const payload = data;

      createCommentValidator.parse(payload);

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
    onError: (err) => {
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Something went wrong, please try again",
      });
    },
    onSuccess: () => {
      toast.success("Your comment posted");
      resetField("text");

      startTransition(() => {
        router.refresh();
      });
    },
  });

  const onSubmit = (data: createCommentValidatorTypes) => {
    createComment(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="py-5 w-full flex flex-col gap-2">
        <h1 className="text-zinc-800 text-sm font-medium">Your comment</h1>
        <div>
          <TextArea
            className="w-full p-3 font-medium placeholder:font-normal text-sm border border-zinc-100 rounded-md outline-none bg-zinc-100 resize-none appearance-none overflow-hidden"
            minRows={3}
            placeholder="Whats you thoughts?"
            {...register("text")}
          />
          {errors.text && (
            <p className="text-red-500 text-xs">{errors.text?.message}</p>
          )}
        </div>
        <Button isLoading={isLoading} className="self-end" type="submit">
          Post
        </Button>
      </div>
    </form>
  );
};

export default CreateComment;
