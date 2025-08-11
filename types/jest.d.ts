export interface Metadata {
  targetFile?: string;
  [key: string]: any;
}

declare global {
  namespace jest {
    interface It {
      metadata?: Metadata;
    }

    interface ItConcurrent {
      metadata?: Metadata;
    }

    interface TestResult {
      metadata?: Metadata;
    }
  }
}

export {};
