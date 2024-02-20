"use client";

import { FC, HTMLAttributes, startTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "./ui/Button";
import {
  joinLeaveCommPayloadValidator,
  JoinLeaveCommPayloadValidatorType,
} from "@/lib/validators";
import { z } from "zod";
import { toast } from "sonner";
import useToast from "@/hooks/use-toast";

interface JoinLeaveCommButtonProps extends HTMLAttributes<HTMLButtonElement> {
  isSubscribed: boolean;
  subredditId: string;
}

const JoinLeaveCommButton: FC<JoinLeaveCommButtonProps> = ({
  isSubscribed,
  subredditId,
}) => {
  const { loginErrToast } = useToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: JoinLeaveCommPayloadValidatorType = {
        subredditId: subredditId,
      };

      joinLeaveCommPayloadValidator.parse(payload);

      const res = await axios.post("/api/subreddit/subscribe", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) return res.data as string;
      else throw new Error("Something went wrong, try again");
    },
    onError: (err) => {
      // if its zod validation error
      if (err instanceof z.ZodError)
        return toast.error("Error", {
          description: err.errors[0].message,
        });

      // if its request error
      // Unauthorized error
      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      // invalid input error
      if (err instanceof axios.AxiosError && err.response?.status === 422)
        return toast.error("Error", {
          description: "Invalid subreddit id",
        });

      if (err instanceof axios.AxiosError && err.response?.status === 400)
        return toast.error("Error", {
          description:
            "You can not subscribe or unsubscribe your own subreddit",
        });

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Somthing went wrong, please try again",
      });
    },
    onSuccess: (res) => {
      if (res === "LEAVED")
        toast.success("Done", {
          description: "You leave community successfuly",
        });

      if (res === "JOINED")
        toast.success("Congrats", {
          description: "You are now part of this community",
          icon: "🥳",
        });

      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <>
      <Button onClick={() => subscribe()} isLoading={isLoading}>
        {!isSubscribed ? "Join to Posts" : "Leave community"}
      </Button>
    </>
  );
};

export default JoinLeaveCommButton;
