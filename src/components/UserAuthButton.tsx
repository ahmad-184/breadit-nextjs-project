import { FC, HTMLAttributes, ReactNode } from "react";
import { Button, buttonVariants } from "./ui/Button";
import { AuthButtonType } from "@/types/authButton";
import { cn } from "@/lib/utils";

interface UserAuthButtonProps extends HTMLAttributes<HTMLDivElement> {
  data: AuthButtonType;
  isLoading: boolean;
}

const UserAuthButton: FC<UserAuthButtonProps> = ({
  data,
  isLoading,
  ...props
}) => {
  return (
    <div className="w-full" {...props}>
      <Button
        className={cn(
          "w-full gap-2 flex items-center",
          data.provider === "github"
            ? buttonVariants({ variant: "outline" })
            : buttonVariants()
        )}
        isLoading={isLoading}
      >
        {data.icon}
        <p className="text-md">{data.text}</p>
      </Button>
    </div>
  );
};

export default UserAuthButton;
