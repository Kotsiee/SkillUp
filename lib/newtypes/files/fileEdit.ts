import { Files } from "./files.ts";

export interface EditFile {
  file: Files;
  transformations?: {
    image?: {
      rotation?: number;
      scale?: number;
      flipX?: boolean;
      flipY?: boolean;
      lastPosX?: number;
      lastPosY?: number;
    };
    text?: {
      content: string;
    };
    audio?: {
      start: number;
      end: number;
    };
    video?: {
      start: number;
      end: number;
    };
  };
}

type FileTypes = {
  [type: string]: string;
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
};
