"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

import "highlight.js/styles/hybrid.css";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

const Highlight = dynamic(
  async () => (await import("react-highlight")).default,
  { ssr: false }
);

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="relative w-full my-2 rounded-md min-h-[10rem] sm:min-h-[19rem] md:min-h-[20rem] lg:min-h-[20rem] xl:min-h-[23rem]">
      <Image
        alt="post image"
        className="object-contain rounded-sm"
        fill
        src={src}
      />
    </div>
  );
};

const CustomCodeRenderer = ({ data }: any) => {
  return (
    <div className="relative w-full max-h-[600px] min-h-[400px] my-3 h-fit rounded-lg overflow-y-auto">
      <div className="bg-gray-100 absolute inset-0 text-sm text-gray-500 h-fit rounded-lg overflow-auto">
        <Highlight>{data.code}</Highlight>
      </div>
    </div>
  );
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput = ({ content }: { content: any }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  );
};

export default EditorOutput;
