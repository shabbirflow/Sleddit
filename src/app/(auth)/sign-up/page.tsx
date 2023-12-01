import { FC } from "react";
import Link from "next/link";
import Signin from "@/components/sign/Signin";
import { ChevronLeft } from "lucide-react";
import SignUp from "@/components/sign/SignUp";

const page: FC = ({}) => {
  return (
    <div className="absolute inset-0 ">
      <div className="h-full flex flex-col items-center justify-center gap-20 max-w-2xl mx-auto">
        
        <Link href="/">
          {" "}
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 items-center justify-center flex flex-row">
            <ChevronLeft  className="h-4 w-4 inline"/> Home
            </span>
          </button>
        </Link>
        <SignUp />
      </div>
    </div>
  );
};

export default page;
