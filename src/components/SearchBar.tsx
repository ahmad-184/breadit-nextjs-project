"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Command } from "./ui/Command";
import { CommandInput } from "cmdk";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import Icons from "./Icons";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  const commandRef = useRef<HTMLDivElement>(null);

  const {
    data: result,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["search-query"],
    queryFn: async () => {
      if (input.length === 0) return [];
      const query = `/api/search?query=${input}`;

      const { data, status } = await axios.get(query);

      if (status !== 200) return [];

      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    enabled: false,
  });

  const debouncedSearch = useCallback(
    debounce(() => {
      refetch();
    }, 500),
    []
  );

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  return (
    <div className="flex flex-grow justify-center">
      <Command
        ref={commandRef}
        className={cn(
          "max-w-lg overflow-visible z-50 relative p-[2px] sm:p-1 border w-full rounded-lg"
        )}
      >
        <CommandInput
          placeholder="Search for communities..."
          className="text-sm border-none outline-none p-2 "
          value={input}
          onValueChange={(e) => {
            setInput(e);
            debouncedSearch();
          }}
        />

        {input.length ? (
          <>
            <div className="absolute top-full mt-1 inset-x-0 bg-white shadow border rounded-lg p-3 flex flex-col gap-1">
              {input.length && isFetching ? (
                <div className="w-full flex justify-center text-zinc-400">
                  <Icons.loader className="animate-spin spin-in-3 w-5" />
                </div>
              ) : input.length && isFetched && !result?.length ? (
                <div className="w-full flex justify-center text-center text-xs sm:text-sm font-medium text-zinc-400">
                  No results found...
                </div>
              ) : null}
              {result?.length ? (
                <>
                  <p className="text-zinc-800 font-medium text-sm">
                    Communitites
                  </p>
                  <div className="flex flex-col gap-2">
                    {result.map((sub) => (
                      <a href={`/r/${sub.name}`} key={sub.id}>
                        <div className="flex gap-1 flex-wrap items-center justify-between ml-1 p-2 bg-zinc-50 hover:bg-zinc-100 cursor-pointer rounded-lg">
                          <div className="flex gap-2 items-center">
                            <Icons.users className="w-4" />
                            <span className="text-sm text-zinc-500 font-medium">
                              r/{sub.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs underline text-zinc-500 font-medium">
                              {sub._count.posts} posts
                            </span>
                            <span className="text-xs text-zinc-500 underline font-medium">
                              {sub._count.Subscriber} Subscribers
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </Command>
    </div>
  );
};

export default SearchBar;
