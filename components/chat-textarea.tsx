"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { UserContentParts } from "@/convex/schema";
import {
  areAttachmentsUploaded,
  Attachment,
  attachmentsToContentParts,
  ImageAttachment,
} from "@/lib/attachment";
import { DEFAULT_MODEL, Model, models } from "@/lib/models";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { AttachmentPreview } from "./attachment-preview";

export function ChatTextarea({
  onSubmit,
  className,
  initialModel,
}: {
  onSubmit: (content: UserContentParts, model: Model) => Promise<void>;
  className?: string;
  initialModel?: Model;
}) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [model, setModel] = useState<Model>(initialModel ?? DEFAULT_MODEL);

  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  async function submit(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!areAttachmentsUploaded(attachments)) {
        return;
      }
      await onSubmit(
        [
          {
            type: "text",
            text,
          },
          ...attachmentsToContentParts(attachments),
        ],
        model,
      );
      setText("");
      setAttachments([]);
    }
  }

  async function attachFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (!files) return;
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        setAttachments((oldAttachments) => [
          ...oldAttachments,
          {
            local: file,
            type: "image_url",
            storageId: null,
          } satisfies ImageAttachment,
        ]);
        const postUrl = await generateUploadUrl();
        const response = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await response.json();
        console.log(storageId);
        setAttachments((oldAttachments) => [
          ...oldAttachments.slice(0, -1),
          {
            ...oldAttachments[oldAttachments.length - 1],
            storageId,
          },
        ]);
      } else if (file.type.startsWith("audio/")) {
        //
      } else {
        //
      }
    }
  }

  useEffect(() => {
    setModel(initialModel ?? DEFAULT_MODEL);
  }, [initialModel]);

  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      <div className="flex items-center gap-2">
        {attachments.map((attachment, index) => (
          <AttachmentPreview key={index} attachment={attachment} />
        ))}
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="resize-none bg-background shadow-sm focus-visible:shadow-lg transition-shadow"
        placeholder="Type a message..."
        autoFocus
        onKeyDown={submit}
      />
      <div className="flex items-center gap-2">
        <Select
          value={model}
          onValueChange={(value) => setModel(value as Model)}
        >
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
        <Button size="sm" slot="label" variant="outline" asChild>
          <label htmlFor="attachments">
            <Paperclip /> Attach
          </label>
        </Button>
        <input
          type="file"
          hidden
          multiple
          value=""
          onChange={attachFile}
          id="attachments"
        />
      </div>
    </div>
  );
}
