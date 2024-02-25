import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UserNameForm from "@/components/UserNameForm";
import { getUserSession } from "@/lib/nextauth-options";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage account and website settings",
};

const Page = async () => {
  const session = await getUserSession();
  if (!session?.user) return notFound();

  return (
    <MaxWidthWrapper className="pt-7">
      <div className="w-full flex flex-col gap-3">
        <h1 className="text-3xl sm:text-5xl font-bold text-zinc-800 mt-5">
          Settings
        </h1>
        <div className="px-5 py-3 rounded-md bg-white">
          <h2 className="text-sm sm:text-lg font-medium text-zinc-800">
            Your username
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Please enter a display name you are comfortable with
          </p>
          <div className="mt-3">
            <UserNameForm username={session.user.username || ""} />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
