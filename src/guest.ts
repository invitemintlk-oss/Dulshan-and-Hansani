import { WEDDING } from "./config";

export const PREFIXES = ["Mr.", "Mrs.", "Miss", "Mr. & Mrs.", "Family", "Dear"] as const;
export type Prefix = (typeof PREFIXES)[number];

const MAX_NAME_LENGTH = 80;

function cleanName(name: string): string {
  return name
    .replace(/\s+/g, " ")
    .trim()
    // The greeting already says "Dear", so never let it be typed into the name.
    .replace(/^dear\s+/i, "")
    .slice(0, MAX_NAME_LENGTH);
}

/**
 * Combines the prefix and the guest name into the name shown on the invitation.
 * "Dear" is a message-style option, so it is never part of the display name.
 */
export function buildDisplayName(prefix: Prefix, guestName: string): string {
  const name = cleanName(guestName);
  if (!name) return "";

  switch (prefix) {
    case "Family":
      return /\band family$/i.test(name) ? name : `${name} and Family`;
    case "Dear":
      return name;
    default: {
      // Avoid "Mr. Mr. Sanjaya" if the prefix was also typed into the name field.
      const alreadyPrefixed = name.toLowerCase().startsWith(prefix.toLowerCase() + " ");
      return alreadyPrefixed ? name : `${prefix} ${name}`;
    }
  }
}

/** Greeting line used in the WhatsApp message. "Dear" appears exactly once. */
export function buildGreeting(displayName: string): string {
  return `Dear ${displayName} ❤️`;
}

/** `{baseURL}/{displayName}` with the name safely URL-encoded. */
export function buildInviteLink(baseURL: string, displayName: string): string {
  return `${baseURL.replace(/\/+$/, "")}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return [
    buildGreeting(displayName),
    "",
    "With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.",
    "",
    "Please view our wedding invitation and all the event details through the link below 🌐:",
    "",
    link,
    "",
    "Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.",
    "",
    "With love,",
    `❤️ ${WEDDING.groom.name} & ${WEDDING.bride.name}`,
  ].join("\n");
}

/** Reads the personalised guest name from the URL path, e.g. `/Mr.%20Sanjaya` → "Mr. Sanjaya". */
export function getGuestNameFromPath(pathname: string): string {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0] ?? "";
  if (!segment || segment.toLowerCase() === "admin" || segment.toLowerCase() === "index.html") return "";
  try {
    return decodeURIComponent(segment.replace(/\+/g, " ")).replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH);
  } catch {
    return "";
  }
}

/** Clipboard helper with a fallback for browsers / non-HTTPS contexts without the Clipboard API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy approach
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
