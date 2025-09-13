import emlformat from "eml-format";
import { BackendEmlReaded, BackendEmlAttachment } from "~/types/backendEml";
import { Buffer } from "buffer";

var eml = "";

const readFile = (fileContent: string) => {
  let parsedEml = null as BackendEmlReaded | null;
  eml = fileContent;
  emlformat.read(eml, function (error: any, data: BackendEmlReaded) {
    if (error) return console.log(error);
    parsedEml = data;
  });

  return parsedEml;
};

const getAttachements = (parsedEml: BackendEmlReaded) => {
  if (!parsedEml) return [];
  const attachmentFiles = [] as BackendEmlAttachment[];
  parsedEml.attachments?.forEach((attachment) => {
    if (!attachment.contentType.startsWith("multipart/alternative")) {
      attachmentFiles.push(attachment);
    }
  });
  return attachmentFiles;
};

const getBodyHtml = (parsedEml: BackendEmlReaded) => {
  if (!parsedEml) return "";
  let bodyHtml = "";
  parsedEml?.attachments?.forEach((attachment) => {
    if (attachment.contentType.startsWith("multipart/alternative")) {
      if (Array.isArray(attachment.data)) {
        attachment.data.forEach((bodyPart) => {
          if (bodyPart.part.headers["Content-Type"].startsWith("text/html")) {
            if (typeof bodyPart.part.body === "string") {
              bodyHtml = emlformat.unquotePrintable(bodyPart.part.body);
            }
          }
        });
      }
    }
  });
  return bodyHtml;
};

const replaceAttachedImages = (
  bodyHtml: string,
  attachments: BackendEmlAttachment[]
) => {
  if (!bodyHtml) return "";

  attachments.forEach((attachment: BackendEmlAttachment) => {
    if (
      attachment.contentType.startsWith("image/") &&
      attachment.id
    ) {
      const cidCode = attachment.id.slice(1, -1);
      const cidPattern = new RegExp(`cid:${cidCode}`, "g");
      const dataUrl = `data:${attachment.contentType.replaceAll(
        '"',
        "'"
      )};base64,${Buffer.from(attachment.data).toString("base64")}`;
      bodyHtml = bodyHtml.replace(cidPattern, dataUrl);
    }
  });
  return bodyHtml;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let parsedEml = await readFile(body.data);
  if (!parsedEml) {
    throw createError({
      statusCode: 400,
      statusMessage: "Error parsing EML file",
    });
  }
  let attachments = await getAttachements(parsedEml);
  let bodyHtml = await getBodyHtml(parsedEml);
  bodyHtml = await replaceAttachedImages(bodyHtml, attachments);

  return {
    ...parsedEml,
    attachments: attachments,
    bodyHtml: bodyHtml,
  };
});
