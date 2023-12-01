"use client";

import { FC, useCallback, useState } from "react";
import { Command } from "./ui/Command";
import {
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Subreddit, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");

  const {
    isFetched,
    isFetching,
    data: queryResults,
    refetch,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as Subreddit[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(async () => {
    refetch();
  }, 250);
  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const router = useRouter();

  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible mt-1">
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
      />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found!</CommandEmpty>}
          {queryResults?.length ?? 0 > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subred, ind) => (
                <CommandItem key={subred.id} value={subred.name}>
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subred.name}`}>r/{subred.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};

export default SearchBar;
