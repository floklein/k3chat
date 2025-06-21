import type { UserMessage } from "../schema";

export function messageContentToChatName(content: UserMessage["content"]) {
  if (typeof content === "string") {
    return content.slice(0, 20);
  }
  return (
    content.find((part) => part.type === "text")?.text.slice(0, 20) ??
    "New Chat"
  );
}
