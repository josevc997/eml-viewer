import { Buffer } from 'buffer';

interface EmlBody {
  boundary: string;
  part: EmlBodyPart;
}

interface UserEmail {
  name: string;
  email: string;
}

interface EmlDataReaded {
  type: 'Buffer'
  data: number[];
}

export interface BackendEmlReaded {
  date: string;
  subject: string;
  from: UserEmail;
  to: UserEmail[];
  headers: EmlHeaders;
  attachments: BackendEmlAttachment[];
}
export interface BackendEmlAttachment {
  id?: string;
  name?: string;
  contentType: string;
  inline?: boolean;
  data: EmlDataReaded | EmlBody[] | Buffer;
}
