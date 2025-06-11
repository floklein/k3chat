"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_MODEL, Model, models } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export function ChatTextarea({
  onSubmit,
  className,
}: {
  onSubmit: (text: string, model: Model) => Promise<void>;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [model, setModel] = useLocalStorage<Model>("model", DEFAULT_MODEL);

  async function submit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await onSubmit(text, model);
      setText("");
    }
  }

  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="resize-none bg-background shadow-sm focus-visible:shadow-lg transition-shadow"
        placeholder="Type a message..."
        autoFocus
        onKeyDown={submit}
      />
      <Select value={model} onValueChange={(value) => setModel(value as Model)}>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(models).map(([key, model]) => (
            <SelectItem key={key} value={key}>
              {model.name} ({model.provider})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
