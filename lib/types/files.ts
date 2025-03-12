import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Entity, Privacy, User } from "./index.ts";

export interface Files {
  id?: string;
  user?: User;
  filePath?: string;
  storedName?: string;
  publicName?: string;
  fileType?: string;
  mimeType?: string;
  verified?: boolean;
  privacyLvl?: Privacy | string;
  meta?: FileMeta;
  extension?: string;
  createdAt?: DateTime;
  publicURL?: string;

  isUpload?: boolean;
}

interface FileMeta {
  application?: string;
  size?: number;
}

export interface FileReference {
  id: string;
  fileId: Files;
  entityType?: Entity | null;
  entityID?: string | null;
  createdAt: DateTime;
}

export interface editFile {
  file: Files;
  saved?: boolean;
  transformations?: {
    image?: {
      rotation?: number;
      scale?: number;
      flipX?: boolean;
      flipY?: boolean;
      lastPosX?: number;
      lastPosY?: number;
    },
    text?: {
      content: string;
    },
    audio?: {
      start: number;
      end: number;
    },
    video?: {
      start: number;
      end: number;
    }
  };
}

type FileTypes = {
  [type: string]: string
};

export const FileTypesImages: FileTypes = {
    "Image": "audio.png",
    "Video": "audio.png",
    "Audio": "audio.png",
    "Document": "audio.png",
    "Spreadsheet": "audio.png",
    "Medical": "audio.png",
    "Scientific": "audio.png",
    "Compression": "audio.png",
    "Executable": "audio.png",
    "Code": "code.png",
    "3D": "audio.png",
    "Font": "audio.png",
    "Data": "audio.png",
    "Vector": "audio.png",
}