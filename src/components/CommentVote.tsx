"use client";

import { useState, useEffect } from "react";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "./ui/Button";
import Icons from "./Icons";
import { cn } from "@/lib/utils";
import {
  CommentVoteValidatorTypes,
  commentVoteValidator,
} from "@/lib/validators";
import useToast from "@/hooks/use-toast";

interface CommentVoteProps {
  initialCurrentUserVote: VoteType | undefined | null;
  commentId: string;
  initialVotesAmount: number;
}

const CommentVote = ({
  initialCurrentUserVote,
  commentId,
  initialVotesAmount,
}: CommentVoteProps) => {
  const [currentUserVote, setCurrentUserVote] = useState<
    VoteType | undefined | null
  >(initialCurrentUserVote);
  const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
  const prevVote = usePrevious(currentUserVote);

  const { loginErrToast } = useToast();

  useEffect(() => {
    setCurrentUserVote(initialCurrentUserVote);
    setVotesAmount(initialVotesAmount);
  }, [initialCurrentUserVote, initialVotesAmount]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteValidatorTypes = {
        commentId,
        voteType,
      };

      await commentVoteValidator.parse(payload);

      const { data, status } = await axios.patch("/api/comment/vote", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (status === 201 || status === 200) return data as string;
    },
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmount((prev) => prev - 1);
      if (voteType === "DOWN") setVotesAmount((prev) => prev + 1);
      setCurrentUserVote(prevVote);
      // if its request error
      // Unauthorized error
      if (err instanceof z.ZodError)
        return toast.error("Error", {
          description: err.errors[0].message,
        });

      if (err instanceof axios.AxiosError && err.response?.status === 401)
        return loginErrToast();

      // if we dont no what the hell error is
      return toast.error("Error", {
        description: "Somthing went wrong, please try again",
      });
    },
    onMutate: (voteType) => {
      if (currentUserVote === voteType) {
        setCurrentUserVote(undefined);
        if (voteType === "UP") setVotesAmount((prev) => prev - 1);
        if (voteType === "DOWN") setVotesAmount((prev) => prev + 1);
      } else {
        setCurrentUserVote(voteType);
        if (voteType === "UP")
          setVotesAmount((prev) => prev + (currentUserVote ? 2 : 1));
        if (voteType === "DOWN")
          setVotesAmount((prev) => prev - (currentUserVote ? 2 : 1));
      }
    },
    onSuccess: () => {},
  });

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        className={cn("p-[5px] h-[2rem]", {
          // "bg-emerald-100": currentUserVote === "UP",
        })}
        onClick={() => vote("UP")}
      >
        <Icons.arrowUp
          className={cn("w-5 h-5", {
            "text-emerald-400 fill-emerald-400": currentUserVote === "UP",
          })}
        />
      </Button>

      <p className="text-sm font-medium text-zinc-800">{votesAmount}</p>

      <Button
        variant="ghost"
        className={cn("p-[5px] h-[2rem]", {
          // "bg-rose-100": currentUserVote === "DOWN",
        })}
        onClick={() => vote("DOWN")}
      >
        <Icons.arrowDown
          className={cn("w-5 h-5", {
            "text-red-500 fill-red-500": currentUserVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
