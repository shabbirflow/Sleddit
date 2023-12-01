import { Command, CommandInput } from "@/components/ui/Command";
import { FC } from "react";
import Image from "next/image";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl bold">SETTINGS</h1>
      <Image src="/thelook.gif" alt="always sunny look gif" width={600} height={600} className="m-8"/>
      <h5>This page is under construction. Check back later</h5>
    </div>
  );
};

export default page;
