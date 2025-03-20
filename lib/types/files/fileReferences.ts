import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Files } from "./files.ts";

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