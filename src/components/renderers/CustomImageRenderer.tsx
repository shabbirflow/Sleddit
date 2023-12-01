"use client";

import Image from "next/image";

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <a href={src}>
        <Image
          alt="image"
          className="object-contain"
          fill
          src={src}
          sizes="(max-width: 500px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
      </a>
    </div>
  );
}

export default CustomImageRenderer;
