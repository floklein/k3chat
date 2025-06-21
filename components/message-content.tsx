import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import Image from "next/image";
import { Markdown } from "./markdown";

function MessageContentImage({ storageId }: { storageId: Id<"_storage"> }) {
  const url = useQuery(api.storage.getStorageUrl, {
    storageId,
  });

  if (!url) return null;
  return (
    <Image
      src={url}
      alt="Uploaded image"
      className="rounded-lg max-w-full w-auto h-auto"
      width={400}
      height={400}
      priority
    />
  );
}

function MessageContentText({
  text,
  role,
  isRefusal = false,
}: {
  text: string;
  role: "user" | "assistant";
  isRefusal?: boolean;
}) {
  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words max-w-full",
        role === "user" && "rounded-lg px-3 py-2 bg-accent",
        isRefusal && "text-red-500 italic",
      )}
    >
      <Markdown>{text}</Markdown>
    </div>
  );
}

export function MessageContent({
  content,
  role,
}: {
  content: Doc<"messages">["content"];
  role: "user" | "assistant";
}) {
  if (typeof content === "string") {
    return <MessageContentText text={content} role={role} />;
  }
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((part, index) => {
          switch (part.type) {
            case "text":
              return (
                <MessageContentText key={index} text={part.text} role={role} />
              );
            case "image_url":
              return (
                <MessageContentImage key={index} storageId={part.storageId} />
              );
            case "refusal":
              return (
                <MessageContentText
                  key={index}
                  text={part.refusal}
                  role={role}
                  isRefusal={true}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  }
  return null;
}
