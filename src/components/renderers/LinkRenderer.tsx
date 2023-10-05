import { FC } from "react";

interface LinkRendererProps {
  data: { link: string; meta: any };
}

const LinkRenderer: FC<LinkRendererProps> = ({ data }) => {
  if (!data.meta.title && !data.meta.description)
    return (
      <a
        href={data.link}
        className="block max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >{data.link}</a>
    );

  return (
    <a
      href={data.link}
      className="block max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      {data.meta.title && (
        <h5 className="mb-1 text-md font-bold tracking-tight text-gray-900 dark:text-white">
          {data.meta.title}
        </h5>
      )}
      {data.meta.description && (
        <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
          {data.meta.description}
        </p>
      )}
    </a>
  );
};

export default LinkRenderer;
