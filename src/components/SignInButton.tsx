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
          <Button>Sign in</Button>
        </Link>
      )}
    </>
  );
};

export default SignInButton;
