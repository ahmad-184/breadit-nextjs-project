import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

type userId = string;

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
      username?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
    username?: string | null;
  }
}
