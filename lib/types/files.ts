import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Privacy } from "./index.ts";

export interface Files {
  id?: string;
  user?: string;
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

  image?: {
    height?: number;
    width?: number;
    colour?: {
      average: string;
      modal: string;
    }
  }

  audio?: IAudio

  video?: {
    height?: number;
    width?: number;
    frameRate?: number;
    duration?: number;
    audio: IAudio;
  }

  text?: {
    encoding: string;
    count: {
      word: number;
      character: number;
    }
  }
}

interface IAudio{
  bitrate?: number;
  samplerate?: number;
  duration?: number;
  volume?: {
    loudest?: number;
    quitest?: number;
    average?: number;
  } 
}

export interface FileReference {
  id?: string;
  file: Files | null;
  entityType?: string | null;
  entityId?: string | null;
  meta: FileReferenceMeta;
  createdAt?: DateTime;
}

export interface FileReferenceMeta {
  publicName?: string;
  description?: string;
}

export interface editFile {
  file: Files;
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