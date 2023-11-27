import { AttachmentHandler } from "./attachmentHandler";

export const attachmentHandlers = [
    new AttachmentHandler('sticker', att => att.url),
    new AttachmentHandler('file', att => att.url),
    new AttachmentHandler('photo', att => att.largePreviewUrl),
    new AttachmentHandler('animated_image', att => att.url),
    new AttachmentHandler('video', att => att.url),
    new AttachmentHandler('audio', att => att.url)
    // new AttachmentHandler('share', att => att.url),
]