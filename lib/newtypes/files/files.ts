import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export interface Files {
  id?: string;
  user?: string;
  recipient?: string;
  filePath?: string;
  storedName?: string;
  publicName?: string;
  fileType?: string;
  mimeType?: string;
  verified?: boolean;
  privacy?: string;
  meta?: FileMeta;
  extension?: string;
  createdAt?: DateTime;
  publicURL?: string;

  isUpload?: boolean;
}

interface FileMeta {
  application?: string;
  size?: number;

  image?: {
    height?: number;
    width?: number;
    colour?: {
      average: string;
      modal: string;
    };
  };

  audio?: IAudio;

  video?: {
    height?: number;
    width?: number;
    frameRate?: number;
    duration?: number;
    audio: IAudio;
  };

  text?: {
    encoding: string;
    count: {
      word: number;
      character: number;
    };
  };
}

interface IAudio {
  bitrate?: number;
  samplerate?: number;
  duration?: number;
  volume?: {
    loudest?: number;
    quitest?: number;
    average?: number;
  };
}

/**
 * Normalize raw file from Supabase DB into a Files object.
 */
export function normalizeFile(raw: any): Files {
  return {
    id: raw.id,
    user: raw.uploader_id,
    recipient: raw.recipient_id,
    filePath: raw.file_path,
    storedName: raw.stored_name,
    publicName: raw.public_name,
    fileType: raw.file_type,
    mimeType: raw.mime_type,
    verified: raw.verified,
    privacy: raw.privacy,
    meta: raw.meta ?? {},
    extension: raw.extension,
    createdAt: raw.created_at ? DateTime.fromISO(raw.created_at) : DateTime.now(),
    publicURL: raw.publicURL || null,
  };
}
