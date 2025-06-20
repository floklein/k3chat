import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { Markdown } from "./markdown";

function MessageContentImage({ storageId }: { storageId: Id<"_storage"> }) {
  const url = useQuery(api.storage.getStorageUrl, {
    storageId,
  });

  if (!url) return null;
  return (
    <div className="max-w-sm">
      <Image
        src={url}
        alt="Uploaded image"
        className="rounded-lg max-w-full h-auto"
        width={400}
        height={300}
      />
    </div>
  );
}

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
                  <MessageContentImage storageId={part.storageId} />
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
