import { MessageContent } from "@/components/message-content";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: Doc<"messages"> }) {
  return (
    <div
      className={cn(
        "flex w-full",
        message.role === "user" ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          message.role === "assistant" && "w-full",
          message.role === "user" &&
            "max-w-[80%] rounded-lg px-3 py-2 shadow-sm bg-accent",
        )}
      >
        <MessageContent content={message.content} />
      </div>
    </div>
  );
}
