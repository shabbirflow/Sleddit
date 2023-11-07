import { Button } from "@/components/ui/Button";
import { stuff } from "@/constants/constants";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { getAuthSession } from "./api/auth/[...nextauth]/route";
import GeneralFeed from "@/components/GeneralFeed";
import CustomFeed from "@/components/CustomFeed";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-expect-error server component */}
        {session && session.user ? <CustomFeed /> : <GeneralFeed />}
        {/* subreddit info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-300 order-first md:order-last">
          <div className="bg-emerald-100 px-4 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" /> Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 py-4 px-4 text-sm leading-6">
            <div className="flex justify-between p-x-4 py-3">
              <p className="text-zinc-700">{stuff.homeTagLine}</p>
            </div>
          </div>

          <Link
            href="/r/create"
            className="m-x-2 m-y-2 w-full justify-center flex"
          >
            <Button className="w-11/12 my-2">Create Community</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
