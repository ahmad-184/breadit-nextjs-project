"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { HTMLAttributes } from "react";

interface BackButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const BackButton = ({ children, ...props }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} {...props}>
      {children}
    </Button>
  );
};

export default BackButton;
