// lib/fileIdentifier.ts

import { extensionCategories } from "./fileCategories.ts";

export interface FileIdentificationResult {
  mimeType: string;
  extension: string;
  category: string;
  application?: string;
  verified: boolean; // true if mimeType aligns with extension
}

/**
 * Identifies a file based on filename & mimeType.
 * 
 * @param fileName   The original file name (e.g. "report.pdf").
 * @param mimeType   The MIME type provided by the browser or server (e.g. "application/pdf").
 * @returns          An object containing the detection results: { mimeType, extension, category, application?, verified }
 */
export function identifyFile(file: File): FileIdentificationResult {
  // Extract everything after the last '.' in the filename
    const fileName = file.name;
    const mimeType = file.type;

    const dotIndex = fileName.lastIndexOf(".");
    const extension = dotIndex !== -1 ? fileName.substring(dotIndex + 1).toLowerCase() : "";
  
    const result: FileIdentificationResult = {
      mimeType,
      extension,
      category: "Unknown",
      verified: false,
    };
  
    // Find all possible matches for the extension
    const matches = Object.entries(extensionCategories)
      .filter(([ext]) => ext === extension)
      .map(([, data]) => data);
  
    if (matches.length > 0) {
      // If a MIME type is provided, match against validMimeTypes
      const exactMatch = matches.find((match) => match.validMimeTypes?.includes(mimeType));
  
      if (exactMatch) {
        result.category = exactMatch.category;
        result.application = exactMatch.application;
        result.verified = true;
      } else {
        // If no exact MIME match, return all possible categories
        result.category = matches.map((m) => m.category).join(" / ");
        result.application = matches.map((m) => m.application).filter(Boolean).join(" / ");
      }
    }
  
    return result;
}
