"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { chatId } = useParams();
  const messages = useQuery(api.messages.getMessages, {
    chatId: chatId as Id<"chats">,
  });

  return (
    <div>
      <div>
        {messages?.map((message) => (
          <div key={message._id}>{message.content.toString()}</div>
        ))}
      </div>
    </div>
  );
}
