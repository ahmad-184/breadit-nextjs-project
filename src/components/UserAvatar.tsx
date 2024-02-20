import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { FC, HTMLAttributes } from "react";
import Image from "next/image";
import Icons from "./Icons";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "image" | "name"> | null | undefined;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, className, ...props }) => {
  return (
    <Avatar className={`relative ${className}`}>
      {user?.image ? (
        <div className={`w-full h-full aspect-square`} {...props}>
          <Image
            src={user.image}
            fill
            alt={`${user.name} profile`}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <p className="sr-only">{user?.name}</p>
          <Icons.user className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
