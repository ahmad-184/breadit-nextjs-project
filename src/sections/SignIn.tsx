"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import { toast } from "sonner";

import Icons from "@/components/Icons";
import UserAuthButton from "@/components/UserAuthButton";

import { AuthButtonType } from "@/types/authButton";

const authButtons: AuthButtonType[] = [
  // {
  //   text: "Google",
  //   provider: "google",
  //   icon: <Icons.google width={17} />,
  // },
  {
    text: "Discrod",
    provider: "discord",
    icon: <Icons.discrod width={21} />,
  },
  {
    text: "Github",
    provider: "github",
    icon: <Icons.github width={21} />,
  },
];

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = (provider: string) => {
    try {
      setLoading(true);
      signIn(provider);
    } catch (err) {
      toast.error("Error", {
        description: "An error occurred while logging in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center text-center">
      <Icons.logo className="w-9 h-9" />
      <h1 className="text-3xl font-bold text-zinc-800">Welcome back</h1>
      <p className="text-zinc-500 font-normal text-sm mb-1">
        By continuing, you are setting up a Breadit account and agree to our
        User Agreement and Privacy Policy.
      </p>
      <div className="flex items-center gap-2 w-full">
        {authButtons.map((item, index) => (
          <UserAuthButton
            data={item}
            key={index}
            onClick={() => handleSignIn(item.provider)}
            isLoading={loading}
          />
        ))}
      </div>
      {/* <div className="mt-2">
        <p className="text-sm text-zinc-600">
          New user?{" "}
          <Link href={"/sign-up"} className="underline">
            sign up
          </Link>
        </p>
      </div> */}
    </div>
  );
};

export default SignIn;
