import { Comment, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPosts = Post & {
  votes: Vote[];
  author: User;
  comments: Comment[];
  subreddit: Subreddit;
};
