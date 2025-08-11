export interface Metadata {
  targetFile?: string;
  [key: string]: any;
}

/**
 * Creates a test title with embedded metadata
 * @param title - The original test title
 * @param metadata - The metadata object to embed
 * @returns A title with metadata encoded as ::meta::{json}
 */
export function createTitleWithMetadata(
  title: string,
  metadata: Metadata,
): string {
  const metadataJson = JSON.stringify(metadata);
  return `${title}::meta::${metadataJson}`;
}

/**
 * Parses metadata from a test title
 * @param title - The test title that may contain metadata
 * @returns An object with the clean title and metadata (if present)
 */
export function parseTitleMetadata(title: string): {
  title: string;
  metadata?: Metadata;
} {
  const metaIndex = title.lastIndexOf("::meta::");

  if (metaIndex === -1) {
    return { title };
  }

  try {
    const cleanTitle = title.substring(0, metaIndex);
    const metadataJson = title.substring(metaIndex + 8); // 8 is the length of '::meta::'
    const metadata = JSON.parse(metadataJson) as Metadata;

    return { title: cleanTitle, metadata };
  } catch (error) {
    // If JSON parsing fails, return the original title without metadata
    console.warn(">>> Failed to parse metadata from title:", title, error);
    return { title };
  }
}

/**
 * Extracts metadata from ancestor titles
 * @param ancestorTitles - Array of ancestor titles
 * @returns The metadata object if found, undefined otherwise
 */
export function extractMetadataFromAncestors(
  ancestorTitles: string[],
): Metadata | undefined {
  for (let i = ancestorTitles.length - 1; i >= 0; i--) {
    const { metadata } = parseTitleMetadata(ancestorTitles[i]);
    if (metadata) {
      return metadata;
    }
  }
  return undefined;
}

/**
 * Cleans ancestor titles by removing metadata
 * @param ancestorTitles - Array of ancestor titles
 * @returns Array of clean ancestor titles with metadata removed
 */
export function cleanAncestorTitles(ancestorTitles: string[]): string[] {
  return ancestorTitles.map((title) => parseTitleMetadata(title).title);
}
