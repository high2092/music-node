export function trim(text: string) {
  return text.replace(/\s+/g, '').toLowerCase();
}

export function shorten(text: string, maxLen?: number) {
  const MAX_LEN = 40;
  maxLen ??= MAX_LEN;
  const TAIL = '...';
  if (text.length + TAIL.length > maxLen - TAIL.length) return text.substring(0, maxLen - TAIL.length) + TAIL;
  return text;
}

export function decodeHtmlEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
