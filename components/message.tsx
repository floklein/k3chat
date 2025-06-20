import { MessageContent } from "@/components/message-content";
import { Doc } from "@/convex/_generated/dataModel";
import { Model, models } from "@/lib/models";
import { cn } from "@/lib/utils";

export function Message({ message }: { message: Doc<"messages"> }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        message.role === "user" ? "self-end items-end w-[80%]" : "items-start",
      )}
    >
      <MessageContent content={message.content} role={message.role} />
      {message.role === "assistant" && (
        <div className="text-xs text-muted-foreground">
          {models[message.model as Model].name}
        </div>
      )}
    </div>
  );
}
