/**
 * Property-Based Testing Configuration
 * 
 * This file contains shared configuration for fast-check property tests.
 * All property tests should run with at least 100 iterations as specified
 * in the design document.
 */

export const PBT_CONFIG = {
  // Minimum number of test iterations for property-based tests
  numRuns: 100,
  
  // Seed for reproducible tests (optional)
  seed: undefined,
  
  // Verbose mode for debugging
  verbose: false,
}

/**
 * Helper function to create a property test tag
 * Format: Feature: {feature_name}, Property {number}: {property_text}
 */
export function createPropertyTag(propertyNumber: number, propertyText: string): string {
  return `Feature: custom-song-platform, Property ${propertyNumber}: ${propertyText}`
}
