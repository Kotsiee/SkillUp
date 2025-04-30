import { Files } from './files.ts';

export interface FileReference {
  id?: string;
  file: Files | null;
  entityType?: string | null;
  entityId?: string | null;
  createdAt?: Date;
  publicName?: string;
  description?: string;
}

/**
 * Normalize raw record into FileReference.
 */
export function normalizeFileReference(raw: any): FileReference {
  return {
    id: raw.id,
    file: raw.file ?? null,
    entityType: raw.entity_type ?? undefined, // assuming you want to default
    entityId: raw.entity_id ?? undefined,
    createdAt: raw.created_at ? new Date(raw.created_at) : undefined,
    publicName: raw.public_name ?? undefined,
    description: raw.description ?? undefined,
  };
}
