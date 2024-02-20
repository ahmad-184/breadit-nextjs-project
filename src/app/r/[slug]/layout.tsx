import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { notFound } from "next/navigation";
import AboutCommunity from "@/components/AboutCommunity";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const session = await getUserSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });

  const subscribersCount = await db.subscription.count({
    where: {
      subreddit: {
        name: subreddit?.name,
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: { id: subreddit?.id },
          user: { id: session.user.id },
        },
      });

  const isSubscribed = Boolean(subscription);

  if (!subreddit) return notFound();

  return (
    <MaxWidthWrapper className="py-6">
      <div className="flex flex-col md:flex-row justify-between gap-5 py-6">
        {/* feeds */}
        <div className="order-last md:order-first flex-grow">{children}</div>
        {/* about community */}
        <div className="order-first md:order-last">
          <AboutCommunity
            isSubscribed={isSubscribed}
            subreddit={subreddit}
            subscribersCount={subscribersCount}
            user={session?.user!}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
