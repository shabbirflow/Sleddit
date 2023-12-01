import Link from "next/link";
import React from "react";
import { Icons } from "./ui/Icons";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import UserAccountNav from "./ui/UserAccountNav";
import { Camera } from "lucide-react";
import Image from "next/image";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();
  // console.log(session);

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-lightWhite border-zinc-300 z-[10] py-2 mb-0">
      <div className="container max-w-7xl h-full mx-auto flex items-start justify-between gap-2">
        <Link className="flex gap-2 items-center" href="/">
          {/* <Image className="h-15 w-15 sm:h-6 sm:w-6" link/> */}
          <Image
            src="/turtle.png"
            alt="sleddit turtle logo"
            width={50}
            height={50}
          />
          {/* <Camera color="red" size={48} /> */}
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Sleddit
          </p>
        </Link>

        <SearchBar />

        {!session && (
          <Link href="/sign-in">
            <button
              type="button"
              className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Sign in
            </button>
          </Link>
        )}
        {session?.user && <UserAccountNav user={session.user} />}
      </div>
    </div>
  );
};

export default Navbar;
