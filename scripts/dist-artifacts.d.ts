export function distArtifacts(pkg: {
  main?: string;
  module?: string;
  types?: string;
  exports?: unknown;
}): string[];
