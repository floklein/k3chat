import { Id } from "@/convex/_generated/dataModel";
import { ContentPartImage } from "@/convex/schema";

export interface ImageAttachment {
  type: "image_url";
  local: File;
  storageId: Id<"_storage"> | null;
}

export type Attachment = ImageAttachment;

export function areAttachmentsUploaded(attachments: Attachment[]) {
  return !attachments.some((attachment) => attachment.storageId === null);
}

export function attachmentsToContentParts(
  attachments: Attachment[],
): ContentPartImage[] {
  return attachments.map((attachment) => {
    return {
      type: "image_url",
      storageId: attachment.storageId!,
    };
  });
}
