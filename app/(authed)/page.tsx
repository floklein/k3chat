"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function NewChatPage() {
  const [text, setText] = useState("");

  return (
    <div className="flex-1 flex items-center justify-center">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-2xl resize-none"
      />
    </div>
  );
}
