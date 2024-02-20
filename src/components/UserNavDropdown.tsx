"use client";

import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/DropdownMenu";
import UserAvatar from "./UserAvatar";

import Link from "next/link";
import { signOut } from "next-auth/react";
import Icons from "./Icons";
import {
  UserNavDropdownOptionsType,
  UserNavDropdownProps,
} from "@/types/navbar";

const option: UserNavDropdownOptionsType[] = [
  {
    text: "Feed",
    link: "/",
  },
  {
    text: "Create community",
    link: "/r/create",
  },
  {
    text: "Settings",
    link: "/setting",
  },
];

const UserNavDropdown: FC<UserNavDropdownProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-white shadow-md p-2 min-w-[180px]"
        align="end"
      >
        <div className="w-full flex flex-col p-1">
          <p className="text-md font-medium">{user?.name}</p>
          <p className="text-sm truncate max-w-[220px]">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />

        {option.map((item, index) => (
          <DropdownMenuItem asChild key={index}>
            <Link href={item.link}>{item.text}</Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: "/sign-in" });
          }}
        >
          <div className="w-full flex gap-1 items-center justify-between font-medium">
            Sign out <Icons.logout className="w-4" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavDropdown;
