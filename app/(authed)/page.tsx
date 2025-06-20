"use client";

import { ChatTextarea } from "@/components/chat-textarea";
import { api } from "@/convex/_generated/api";
import { UserContentParts } from "@/convex/schema";
import { Model } from "@/lib/models";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export default function NewChatPage() {
  const router = useRouter();

  const createChat = useMutation(api.chats.createChat);

  async function submit(content: UserContentParts, model: Model) {
    const chatId = await createChat({ content, model });
    router.push(`/${chatId}`);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <ChatTextarea onSubmit={submit} className="w-full max-w-2xl" />
    </div>
  );
}
