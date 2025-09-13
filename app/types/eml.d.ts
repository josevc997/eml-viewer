interface EmlHeaders {
  "Delivered-To": string;
  Received: string[];
  "X-Forwarded-Encrypted": string[];
  "X-Received": string[];
  "ARC-Seal": string;
  "ARC-Message-Signature": string;
  "ARC-Authentication-Results": string;
  "Return-Path": string;
  "Received-SPF": string;
  "Authentication-Results": string;
  "DKIM-Signature": string;
  "X-Google-DKIM-Signature": string;
  "X-Gm-Message-State": string;
  "X-Gm-Gg": string;
  "X-Google-Smtp-Source": string;
  "MIME-Version": string;
  References: string;
  "In-Reply-To": string;
  From: string;
  Date: string;
  "X-Gm-Features": string;
  "Message-ID": string;
  Subject: string;
  To: string;
  "Content-Type": string;
}

interface EmlBodyPartHeaders {
  "Content-Type": string;
  "Content-Transfer-Encoding": string;
  "Content-ID"?: string;
  "Content-Disposition"?: string;
  "X-Attachment-Id"?: string;
}

interface EmlBodyPart {
  headers: EmlBodyPartHeaders;
  body: EmlBody[] | string;
}

interface EmlBody {
  boundary: string;
  part: EmlBodyPart;
}

interface EmlData {
  headers: EmlHeaders;
  body: EmlBody[];
}

interface UserEmail {
  name: string;
  email: string;
}

interface EmlDataReaded {
  type: 'Buffer'
  data: number[];
}

interface EmlAttachment {
  id?: string;
  name?: string;
  contentType: string;
  inline?: boolean;
  data: EmlDataReaded | EmlBody[] | Buffer;
}

interface EmlReaded {
  date: string;
  subject: string;
  from: UserEmail;
  to: UserEmail[] | UserEmail;
  headers: EmlHeaders;
  attachments: EmlAttachment[];
}

interface EmlReadedUpdated extends EmlReaded {
  bodyHtml: string;
}