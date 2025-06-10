"use client";

import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";

export default function NewChatPage() {
  const createChat = useMutation(api.chats.createChat);

  const [text, setText] = useState("");

  const submit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      createChat({ content: text });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-2xl resize-none"
        onKeyDown={submit}
      />
    </div>
  );
}
