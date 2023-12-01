import { FC } from "react";
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { Users } from "lucide-react";

interface RecommendationsProps {}

const Recommendations = async ({}) => {
  const session = await getAuthSession();
  if (!session?.user) return <></>;
  console.log("HEYYY");

  const recs = await db.subreddit.findMany({
    where: {
      NOT: {
        subscribers: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    orderBy: {
      subscribers: {
        _count: "desc",
      },
    },
    take: 5,
  });

  // console.log(recs);

  return (
    <div className="overflow-hidden h-fit rounded-lg border border-gray-300 order-first md:order-last mt-2">
      <div className="bg-emerald-100 px-4 py-2">
        <p className="font-semibold py-2 flex items-center gap-1.5">
          🔥 Popular
        </p>
      </div>

      <div className="-my-3 divide-y divide-gray-100 py-3 text-sm leading-6">
        <div className="flex justify-between py-2">
          <ul className="col-span-1 flex flex-row gap-0 md:flex-col w-full">
            {recs.map((sub, ind) => (
              <li
                key={sub.id}
                className={`${ind % 2 === 0 ? "bg-lightWhite" : ""} flex flex-row p-2 justify-normal items-center`}
              >
                <Users className="pr-2 h-4 w-4" />
                <a href={`/r/${sub.name}`} className="font-bold">
                  r/{sub.name}
                </a>
                <br className="border" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
