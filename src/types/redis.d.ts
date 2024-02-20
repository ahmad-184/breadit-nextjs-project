import { VoteType } from "@prisma/client";

export type CachePostPayloadType = {
  authorUsername: string;
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};
