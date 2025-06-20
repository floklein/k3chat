import { Attachment } from "@/lib/attachment";
import Image from "next/image";

function AttachmentContent({ attachment }: { attachment: Attachment }) {
  if (attachment.type === "image_url") {
    return (
      <Image
        src={URL.createObjectURL(attachment.local)}
        alt={attachment.local.name}
        className="object-cover w-full h-full"
        width={100}
        height={100}
      />
    );
  }
  if (attachment.type === "input_audio") {
    return <div>{attachment.local.name}</div>;
  }
  if (attachment.type === "file") {
    return <div>{attachment.local.name}</div>;
  }
}

export function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  return (
    <div className="size-20 rounded-md overflow-hidden">
      <AttachmentContent attachment={attachment} />
    </div>
  );
}
