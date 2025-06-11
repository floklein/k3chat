import { MessageContent } from "@/components/message-content";
import { Doc } from "@/convex/_generated/dataModel";
import { Model, models } from "@/lib/models";
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
            "max-w-[80%] rounded-lg px-3 py-2 bg-accent",
        )}
      >
        <MessageContent content={message.content} />
        {message.role === "assistant" && (
          <div className="text-xs text-muted-foreground">
            {models[message.model as Model].name}
          </div>
        )}
      </div>
    </div>
  );
}
