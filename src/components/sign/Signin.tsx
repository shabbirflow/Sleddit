import Image from "next/image";
import { FC } from "react";
import { stuff } from "../../constants/constants";
import Link from "next/link";
import UserAuthForm from "../UserAuthForm";
interface SigninProps {}

const Signin: FC<SigninProps> = ({}) => {
  return (
    <div className="container mx-auto w-full flex flex-col items-center justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Image
          src="/turtle.png"
          className="mx-auto h-18 w-18 sm:h-10 sm:w-10"
          alt="site logo turtle"
          width={400}
          height={400}
        />
        <h1 className="font-semibold tracking-tight text-2xl">Welcome back</h1>
        <p className="text-md mx-auto">{stuff.signinLine}</p>
        <p className="text-md mx-auto">{stuff.signinSubLine}</p>
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to Sleddit ?{" "}
          <Link href="sign-up">
            <button
              type="button"
              className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-2 mb-2"
            >
              Sign Up
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
