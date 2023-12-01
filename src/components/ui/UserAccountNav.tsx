"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User } from "next-auth";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="text-center">
        <button
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className={`bg-emerald-100 hover:bg-bg-emerald-100 focus:ring-4 focus:outline-none shadow-md
          focus:bg-emerald-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center
           dark:dropDownBG dark:hover:dropDownBG dark:focus:dropDownBG ${
             isOpen ? "dropDownBG" : ""
           }`}
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          <UserAvatar
            className="h-8 w-8"
            user={{ name: user.name || null, image: user.image || null }}
          />
          {user.name && <p className="font-medium m-0.5">{user.name}</p>}
          <svg
            className="w-2.5 h-2.5 ml-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1 4 4 9 1"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            id="dropdown"
            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  href="/r/create"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Create Community
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </Link>
              </li>
              <li
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/sign-in`,
                  });
                }}
              >
                Sign out
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccountNav;
