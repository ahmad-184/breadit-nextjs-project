import Icons from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import SignIn from "@/components/SignIn";
import Link from "next/link";

export default function Page() {
  return (
    <MaxWidthWrapper className="h-screen -mt-16 flex items-center justify-center">
      <div className="w-full sm:max-w-[400px] ">
        <Link
          href={"/"}
          className={cn(
            "flex gap-1 items-center",
            buttonVariants({ variant: "ghost" })
          )}
        >
          <Icons.home width={20} height={20} />
          {/* Home */}
        </Link>
        <SignIn />
      </div>
    </MaxWidthWrapper>
  );
}
