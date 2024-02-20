"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";
import Icons from "./Icons";

interface MiniCreatePostProps {
  session: Session | null | undefined;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handlePushToCreatePostRoute = () => router.push(`${pathname}/submit`);

  return (
    <div className="bg-white p-3 py-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center w-full gap-5">
        <UserAvatar user={session?.user} />
        <div className="flex gap-2 items-center flex-grow">
          <Input
            readOnly
            placeholder="Create post"
            onClick={handlePushToCreatePostRoute}
            className="placeholder:font-medium placeholder:text-zinc-400"
          />
          <span
            onClick={handlePushToCreatePostRoute}
            className="p-2 bg-zinc-100 rounded-full cursor-pointer text-zinc-500 hover:text-zinc-700"
          >
            <Icons.image className="w-4 h-4" />
          </span>
          <span
            onClick={handlePushToCreatePostRoute}
            className="p-2 bg-zinc-100 rounded-full cursor-pointer text-zinc-500 hover:text-zinc-700"
          >
            <Icons.link className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiniCreatePost;
