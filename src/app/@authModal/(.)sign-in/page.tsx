"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Button } from "@/components/ui/Button";
import Icons from "@/components/Icons";
import SignIn from "@/sections/SignIn";

export default function Page() {
  const modalRef = useRef(null);
  const router = useRouter();

  const onClickHandler = () => {
    router.back();
  };

  useOnClickOutside(modalRef, onClickHandler);

  return (
    <div className="fixed z-50 bg-zinc-900/40 inset-0 flex items-center scroll-auto justify-center">
      <div
        className="w-fit h-fit relative bg-white rounded-lg py-8 px-1"
        ref={modalRef}
      >
        <div className="container h-full flex items-center justify-center">
          <Button
            onClick={onClickHandler}
            className="absolute top-2 right-2 rounded-lg px-2 h-8"
            variant="ghost"
            aria-label="close modal"
          >
            <Icons.x className="w-4 h-4" />
          </Button>
          <div className="w-full max-w-[400px]">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
