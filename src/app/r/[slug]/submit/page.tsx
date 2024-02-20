import Editor from "@/components/Editor";
import { db } from "@/lib/db";

interface PageTypes {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageTypes) {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
  });

  return (
    <div className="w-full">
      <div className="mb-7">
        <span className="text-zinc-800 text-xl mr-3 font-bold">
          Create post
        </span>
        <span className="text-zinc-600 underline font-medium">
          in r/{subreddit?.name}
        </span>
      </div>
      <Editor subredditId={subreddit?.id as string} />
    </div>
  );
}
