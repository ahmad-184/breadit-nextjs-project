"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { toast } from "sonner";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  CreateSubredditValidatorType,
  createSubredditValidator,
} from "@/lib/validators";
import useToast from "@/hooks/use-toast";

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { loginErrToast } = useToast();

  const { mutate: createSubreddit, isLoading } = useMutation({
    mutationFn: async () => {
      const filteredInput = input.replaceAll(" ", "_");

      const data: CreateSubredditValidatorType = {
        name: filteredInput,
      };

      createSubredditValidator.parse(data);

      if (error.length) setError("");

      const res = await axios.post("/api/subreddit", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        return res.data as string;
      } else throw new Error("Something went wrong, try again");
    },
    onError: (err) => {
      // if its zod validation error
      if (err instanceof z.ZodError) return setError(err.errors[0].message);

      // if its request error
      // Unauthorized error
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      // existing resource error
      if (err instanceof axios.AxiosError && err.response?.status === 409)
        return setError("a community with this name already exist");

      // invalid input error
      if (err instanceof axios.AxiosError && err.response?.status === 422)
        return setError(
          "invalid community name, please choose a name between 3 and 21 characters"
        );

      // if we dont no what the hell error is
      return setError("somthing went wrong, please try again");
    },
    onSuccess: (data) => {
      // show success toast and after 3 secconds push user to subreddit feeds
      toast.success("Success", {
        description: "Community successfuly created",
        icon: "🥳",
        position: "top-center",
      });
      router.push(`/r/${data}`);
    },
  });

  return (
    <MaxWidthWrapper className="py-10 flex justify-center">
      <div className="w-full sm:w-[500px] bg-white rounded-md p-4 py-6">
        <h1 className="text-zinc-800 font-medium text-xl sm:text-2xl text-center pb-4">
          Create a community
        </h1>
        <hr className="border-dashed" />
        <div className="pt-4">
          <h3 className="text-md sm:text-lg text-zinc-700 font-medium">Name</h3>
          <p className="text-sm font-normal text-zinc-500 mb-3">
            community names including capitalization cannot be changed.
          </p>
          <div className="mb-3">
            <div className="relative">
              <p className="absolute top-[50%] translate-y-[-50%] left-3 text-zinc-400 text-sm">
                r/
              </p>
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="pl-6"
                onKeyDown={(e) => {
                  if (e.key === "Enter") createSubreddit();
                }}
              />
            </div>
            {error && (
              <p className="text-rose-600 text-xs mt-1 font-medium ml-2">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-end items-center">
            <Button variant="subtle" onClick={() => router.back()}>
              Back
            </Button>
            <Button
              disabled={input.trim().length < 3 ? true : false}
              isLoading={isLoading}
              type="submit"
              onClick={() => createSubreddit()}
            >
              Create community
            </Button>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
