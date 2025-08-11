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
 * Extracts metadata from ancestor titles and test title
 * @param ancestorTitles - Array of ancestor titles
 * @param testTitle - The test title (optional)
 * @returns The metadata object if found, undefined otherwise
 */
export function extractMetadataFromAncestors(
  ancestorTitles: string[],
  testTitle?: string,
): Metadata | undefined {
  // First check the test title itself (highest priority)
  if (testTitle) {
    const { metadata } = parseTitleMetadata(testTitle);
    if (metadata) {
      return metadata;
    }
  }

  // Then check ancestor titles from last to first
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
