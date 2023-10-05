import "@/styles/globals.css";
import { Karla } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { stuff } from "@/constants/constants";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

export const metadata = {
  title: stuff.title,
  description: "A Reddit clone built with Next.js, TypeScript and MySQL.",
};

const karla = Karla({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-800 antialised light",
        karla.className
      )}
    >
      <head>
        <link rel="icon" href="/turtle.png" sizes="40x40" />
      </head>
      <body className="min-h-screen pt-12 antialiased bg-appBG">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />
          <div className="pt-12 container max-w-7xl mx-auto h-full">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
