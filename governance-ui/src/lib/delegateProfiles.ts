/**
 * Delegate Profile Configuration
 *
 * This file contains custom profiles for known delegates.
 * To add your delegate profile, create a PR with your information added to the profiles array.
 */

export interface DelegateProfile {
  address: string; // Starknet address (will be normalized for matching)
  name: string;
  avatar?: string; // URL to avatar image (supports .png, .jpg, .jpeg, .svg, .webp)
  description?: string;
  twitter?: string; // Twitter handle (without @)
  website?: string;
}

/**
 * Normalize address for comparison (lowercase, remove leading zeros after 0x)
 */
export function normalizeAddress(address: string): string {
  const cleaned = address.toLowerCase().trim();
  // Remove leading zeros after 0x prefix for consistent comparison
  if (cleaned.startsWith("0x")) {
    return "0x" + cleaned.slice(2).replace(/^0+/, "");
  }
  return cleaned;
}

/**
 * Get delegate profile by address
 */
export function getDelegateProfile(
  address: string
): DelegateProfile | undefined {
  const normalized = normalizeAddress(address);
  return delegateProfiles.find(
    (profile) => normalizeAddress(profile.address) == normalized
  );
}

/**
 * Delegate profiles configuration
 * Add your profile here or submit a PR to add it!
 */
export const delegateProfiles: DelegateProfile[] = [
  {
    address:
      "0x026a83fedfbdc1030e1730a0dbf2d6df79ffd3c27daa0bbe101a499e5d8d6a07",
    name: "Distracteddev",
    avatar: "/avatars/dd_avatar.png",
    description: "Active governance participant",
  },
  {
    address:
      "0x000b39b235b44c53a2e9f0c5d35939d9c8e8dafdd0a2ba2e695b501fc1e9fd2f",
    name: "Provable Games",
    avatar: "/avatars/pg_avatar.svg",
    description: "Community delegate",
  },
  {
    address:
      "0x0159088470dd272f3d78d270cbf13be0bbe378e09c09f56dd33dc42501309c0c",
    name: "Loothero",
    avatar: "/avatars/lh_avatar.jpg",
    description: "Governance contributor",
  },
];
