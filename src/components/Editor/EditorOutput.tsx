"use client";

import CustomCodeRenderer from "@/components/renderers/CustomCodeRenderer";
import CustomImageRenderer from "@/components/renderers/CustomImageRenderer";
import { FC } from "react";
import LinkRenderer from "../renderers/LinkRenderer";
import { Heading5 } from "lucide-react";
import TableComponent from "../renderers/TableComponent";

interface EditorOutputProps {
  content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  // console.log(content)
  return (
    <div className="leading-4 text-sm">
      <ul className="flex flex-col align-baseline justify-start gap-2">
        {content.blocks.map((x: any, ind: number) => {
          if (x.type === "image") {
            return <CustomImageRenderer data={x.data} key={ind} />;
          } else if (x.type === "linkTool") {
            return <LinkRenderer data={x.data} key={ind} />;
          } else if (x.type === "paragraph") {
            return <p key={ind}>{x.data.text}</p>;
          } else if (x.type === "table") {
            return <TableComponent data = {x.data} key = {ind}/>
          } else if (x.type === "list") {
            return <ul
              className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 m-2 ml-2"
              key={ind}
            >
              {x.data.items.map((x: string, ind: number) => <li key={`listItem_${ind}`}>{x}</li>)}
            </ul>;
          } else if (x.type === "code") {
            return <CustomCodeRenderer data={x.data} key={ind} />;
          } else if (x.type === "header") {
            return <h5 key={ind}>{x.data.text}</h5>;
          }
        })}
      </ul>
    </div>
  );
};

export default EditorOutput;
