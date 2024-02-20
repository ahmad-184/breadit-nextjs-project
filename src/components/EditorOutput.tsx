"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false }
);

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="relative w-full min-h-[12rem]">
      <Image alt="post image" className="object-contain" fill src={src} />
    </div>
  );
};

const CustomCodeRenderer = ({ data }: any) => {
  return (
    <pre className="bg-gray-100 text-sm text-gray-500 rounded-md p-2 overflow-auto">
      <code>{data.code}</code>
    </pre>
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
