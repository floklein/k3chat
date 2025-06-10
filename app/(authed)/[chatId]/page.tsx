"use client";

import { MessageBubble } from "@/components/message-bubble";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const { chatId } = useParams();
  const createMessage = useMutation(api.messages.createMessage);

  const [text, setText] = useState("");

  const messages = useQuery(api.messages.getMessages, {
    chatId: chatId as Id<"chats">,
  });

  async function submit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await createMessage({
        chatId: chatId as Id<"chats">,
        content: text,
      });
      setText("");
    }
  }

  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto">
      <div className="max-w-3xl w-full flex flex-col flex-1">
        <div className="flex flex-col flex-1 space-y-4 p-6">
          {messages?.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))}
        </div>
        <div className="bg-background px-4 pb-4 sticky bottom-0">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="resize-none border-none"
            placeholder="Type a message..."
            autoFocus
            onKeyDown={submit}
          />
        </div>
      </div>
    </div>
  );
}
