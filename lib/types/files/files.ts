import { DateTime } from "https://esm.sh/luxon@3.5.0";

export interface Files {
  id?: string;
  user?: string;
  filePath?: string;
  storedName?: string;
  publicName?: string;
  fileType?: string;
  mimeType?: string;
  verified?: boolean;
  privacyLvl?: string;
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