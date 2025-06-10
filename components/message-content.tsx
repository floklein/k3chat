import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Markdown } from "./markdown";

export function MessageContent({
  content,
}: {
  content: Doc<"messages">["content"];
}) {
  if (typeof content === "string") {
    return (
      <div className="whitespace-pre-wrap break-words">
        <Markdown>{content}</Markdown>
      </div>
    );
  }
  if (Array.isArray(content)) {
    return (
      <div className="space-y-2">
        {content.map((part, index) => {
          switch (part.type) {
            case "text":
              return (
                <div key={index} className="whitespace-pre-wrap break-words">
                  <Markdown>{part.text}</Markdown>
                </div>
              );
            case "image_url":
              return (
                <div key={index} className="max-w-sm">
                  <Image
                    src={part.image_url.url}
                    alt="Uploaded image"
                    className="rounded-lg max-w-full h-auto"
                    width={400}
                    height={300}
                  />
                </div>
              );
            case "refusal":
              return (
                <div key={index} className="text-red-500 italic">
                  {part.refusal}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }
  return null;
}
