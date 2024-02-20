import CustomFeed from "@/components/CustomFeed";
import GeneralFeed from "@/components/GeneralFeed";
import Icons from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/Button";
import { getUserSession } from "@/lib/nextauth-options";
import Link from "next/link";

export default async function Home() {
  const session = await getUserSession();

  return (
    <MaxWidthWrapper className="pt-7">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-zinc-900">Your feed</h1>
        <div className="flex flex-col md:flex-row justify-between gap-5 py-6 pt-7 items-start">
          {/* feeds */}
          <div className="order-last md:order-first flex-grow w-full md:w-auto">
            {session?.user ? <CustomFeed session={session} /> : <GeneralFeed />}
          </div>
          {/* subreddits info */}
          <div className="order-first md:order-last w-full md:w-auto">
            <div className="w-full md:w-[250px] lg:w-[300px] overflow-hidden rounded-md h-fit bg-white border border-zinc-200">
              <div className="w-full py-6 px-4 bg-emerald-200 flex items-center">
                <Icons.home className="w-4 h-4" />{" "}
                <p className="text-sm text-zinc-900 font-bold ml-1">Home</p>
              </div>
              <div className="py-4 px-4">
                <p className="text-sm font-normal text-zinc-500">
                  Your personal Breadit homepage. come here to check in with
                  your favorite communities.
                </p>
                <div className="pt-5 w-full">
                  <Link
                    href="/r/create"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Create Community
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
