export function extractVideoId(url: string) {
  const regexList = [/^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/, /^https:\/\/www\.google\.com\/search\?.*?vid:([A-Za-z0-9_-]+)$/, /^https:\/\/youtu\.be\/([A-Za-z0-9_-]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
}
