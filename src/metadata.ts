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
 * Extracts and merges metadata from ancestor titles and test title
 * @param ancestorTitles - Array of ancestor titles
 * @param testTitle - The test title (optional)
 * @returns The merged metadata object if found, undefined otherwise
 */
export function extractMetadataFromAncestors(
  ancestorTitles: string[],
  testTitle?: string,
): Metadata | undefined {
  const allMetadata: Metadata[] = [];
  const metadataSources: string[] = [];

  // First check ancestor titles from first to last (smaller to larger scope)
  // This gives lower priority to broader describe blocks
  for (let i = 0; i < ancestorTitles.length; i++) {
    const { metadata } = parseTitleMetadata(ancestorTitles[i]);
    if (metadata) {
      allMetadata.push(metadata);
      metadataSources.push(`ancestor[${i}]`);
    }
  }

  // Then check the test title itself (highest priority)
  if (testTitle) {
    const { metadata } = parseTitleMetadata(testTitle);
    if (metadata) {
      allMetadata.push(metadata);
      metadataSources.push("test title");
    }
  }

  // If no metadata found, return undefined
  if (allMetadata.length === 0) {
    return undefined;
  }

  // Merge all metadata objects, with later ones (higher priority) overriding earlier ones
  const mergedMetadata: Metadata = {};

  for (const metadata of allMetadata) {
    Object.assign(mergedMetadata, metadata);
  }

  // Debug logging when multiple metadata sources are merged
  if (allMetadata.length > 1) {
    console.log(">>> Merging metadata from multiple sources:", metadataSources);
    console.log(">>> Final merged metadata:", mergedMetadata);
  }

  return mergedMetadata;
}

/**
 * Extracts metadata with debug information about the merge process
 * @param ancestorTitles - Array of ancestor titles
 * @param testTitle - The test title (optional)
 * @returns Object containing the merged metadata and debug information
 */
export function extractMetadataWithDebug(
  ancestorTitles: string[],
  testTitle?: string,
): {
  metadata?: Metadata;
  debug: {
    sources: string[];
    individualMetadata: Metadata[];
    mergeOrder: string[];
  };
} {
  const allMetadata: Metadata[] = [];
  const metadataSources: string[] = [];
  const mergeOrder: string[] = [];

  // First check ancestor titles from first to last (smaller to larger scope)
  for (let i = 0; i < ancestorTitles.length; i++) {
    const { metadata } = parseTitleMetadata(ancestorTitles[i]);
    if (metadata) {
      allMetadata.push(metadata);
      metadataSources.push(`ancestor[${i}]`);
      mergeOrder.push(`ancestor[${i}] (${ancestorTitles[i]})`);
    }
  }

  // Then check the test title itself (highest priority)
  if (testTitle) {
    const { metadata } = parseTitleMetadata(testTitle);
    if (metadata) {
      allMetadata.push(metadata);
      metadataSources.push("test title");
      mergeOrder.push(`test title (${testTitle})`);
    }
  }

  // If no metadata found, return debug info with no metadata
  if (allMetadata.length === 0) {
    return {
      debug: {
        sources: [],
        individualMetadata: [],
        mergeOrder: [],
      },
    };
  }

  // Merge all metadata objects, with later ones (higher priority) overriding earlier ones
  const mergedMetadata: Metadata = {};

  for (const metadata of allMetadata) {
    Object.assign(mergedMetadata, metadata);
  }

  return {
    metadata: mergedMetadata,
    debug: {
      sources: metadataSources,
      individualMetadata: allMetadata,
      mergeOrder,
    },
  };
}

/**
 * Cleans ancestor titles by removing metadata
 * @param ancestorTitles - Array of ancestor titles
 * @returns Array of clean ancestor titles with metadata removed
 */
export function cleanAncestorTitles(ancestorTitles: string[]): string[] {
  return ancestorTitles.map((title) => parseTitleMetadata(title).title);
}
