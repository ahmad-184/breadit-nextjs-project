"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button, buttonVariants } from "./ui/Button";

const SignInButton = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname.startsWith("/sign-in") ? null : (
        <Link href="/sign-in">
          <Button className="text-xs p-3 sm:text-sm">Sign in</Button>
        </Link>
      )}
    </>
  );
};

export default SignInButton;
