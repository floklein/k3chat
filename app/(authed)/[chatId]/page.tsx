"use client";

import { ChatTextarea } from "@/components/chat-textarea";
import { Message } from "@/components/message";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UserContentParts } from "@/convex/schema";
import { Model } from "@/lib/models";
import { useMutation, useQuery } from "convex/react";
import { use } from "react";

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const chatId = use(params).chatId as Id<"chats">;

  const createUserMessage = useMutation(api.messages.createUserMessage);

  const chat = useQuery(api.chats.getChat, {
    chatId,
  });

  const messages = useQuery(api.messages.getMessages, {
    chatId,
  });

  async function submit(content: UserContentParts, model: Model) {
    await createUserMessage({
      chatId,
      content,
      model,
    });
  }

  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto">
      <div className="max-w-3xl w-full flex flex-col flex-1">
        <div className="flex flex-col flex-1 space-y-12 p-6">
          {messages?.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        </div>
        <div className="px-4 pb-4 sticky bottom-0 backdrop-blur-lg bg-background/80">
          <ChatTextarea onSubmit={submit} initialModel={chat?.model as Model} />
        </div>
      </div>
    </div>
  );
}
