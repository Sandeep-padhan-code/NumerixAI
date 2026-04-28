const replacements: Array<[RegExp, string]> = [
  [/\brouowing\b/gi, "following"],
  [/\bANDNSWEr\b/gi, "ANSWER"],
  [/\bedz\b/gi, "dz"],
  [/\bdz\s*[_-]\b/gi, "dz"],
  [/\blz\]\s*=\s*1\b/gi, "|z| = 1"],
  [/\blz\|\s*=\s*1\b/gi, "|z| = 1"],
  [/\blz\s*=\s*1\b/gi, "|z| = 1"],
  [/\blz\b/gi, "|z|"],
  [/\bco\s*:/gi, "C:"],
  [/\bc0\s*:/gi, "C:"],
  [/a\s*©\s*\|?z\|?\s*=\s*1/gi, "over C: |z| = 1"],
  [/§/g, "∮"],
  [/∮\s*_/g, "∮"],
  [/zi,/gi, "z"],
  [/ï¿½|�/g, "∮"],
  [/775,/g, "corrupted denominator"],
  [/5\s*[—–-]\s*,/g, "corrupted fraction"],
  [/[“”]/g, "\""],
  [/[‘’]/g, "'"],
  [/[^\S\r\n]+/g, " "]
];

export function cleanMathOcrInput(input: string) {
  let cleaned = input.normalize("NFKC");

  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  cleaned = cleaned
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const suspiciousFragments = [
    "corrupted denominator",
    "corrupted fraction",
    "∮",
    "|z|",
    "C:"
  ];

  const likelyCorrupted =
    /[�]|_{2,}|[^\w\s()[\]{}.,;:+\-*/=|^$\\∫∮π∞<>]/.test(input) ||
    suspiciousFragments.some((fragment) => cleaned.includes(fragment));

  return {
    cleaned,
    likelyCorrupted
  };
}
