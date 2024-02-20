import { z } from "zod";

export const createSubredditValidator = z.object({
  name: z
    .string()
    .min(3, { message: "cummunity name must have more than 3 characters" })
    .max(21, { message: "name can not have more than 21 characters" }),
});

export type CreateSubredditValidatorType = z.infer<
  typeof createSubredditValidator
>;

export const joinLeaveCommPayloadValidator = z.object({
  subredditId: z.string(),
});

export type JoinLeaveCommPayloadValidatorType = z.infer<
  typeof joinLeaveCommPayloadValidator
>;

export const createPostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must have more than 3 characters" })
    .max(50, { message: "Title can not have more than 50 characters" }),
  content: z.any(),
  subredditId: z.string(),
});

export type CreatePostValidatorType = z.infer<typeof createPostValidator>;

export const postVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostVoteValidatorTypes = z.infer<typeof postVoteValidator>;

export const commentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type CommentVoteValidatorTypes = z.infer<typeof commentVoteValidator>;

export const createCommentValidator = z.object({
  text: z
    .string()
    .min(10, { message: "Minimum 10 characters required" })
    .max(100, { message: "Reached to max charachters" }),
  postId: z.string(),
});

export type createCommentValidatorTypes = z.infer<
  typeof createCommentValidator
>;
