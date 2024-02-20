import { User } from "next-auth";

export type UserNavDropdownOptionsType = { text: string; link: string };

export interface UserNavDropdownProps {
  user: Pick<User, "email" | "image" | "name">;
}
