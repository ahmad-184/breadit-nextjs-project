"use client";

import Link from "next/link";

import Icons from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/Button";
import BackButton from "@/components/BackButton";

const NotFound = () => {
  return (
    <MaxWidthWrapper className="h-screen -mt-16 flex items-center justify-center">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-8xl sm:text-9xl font-bold text-zinc-800">404</h1>
        <p className="text-lg font-medium">Page you looking for not founded</p>
        <div className="flex gap-2 justify-center">
          <BackButton
            className={buttonVariants({
              variant: "link",
              className: "flex items-center gap-1",
            })}
          >
            <Icons.arrowLeft className="w-4" /> Back
          </BackButton>
          <Link
            href={"/"}
            className={buttonVariants({
              variant: "outline",
              className: "flex items-center gap-1",
            })}
          >
            <Icons.home className="w-4" /> Home
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default NotFound;
