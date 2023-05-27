export function trim(text: string) {
  return text.replace(/\s+/g, '').toLowerCase();
}

export function shorten(text: string) {
  const MAX_LEN = 40;
  const TAIL = '...';
  if (text.length + TAIL.length > MAX_LEN - TAIL.length) return text.substring(0, MAX_LEN - TAIL.length) + TAIL;
  return text;
}
