export function extractVideoId(url: string) {
  const regexList = [/^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^&]+)/, /^https:\/\/www\.google\.com\/search\?gs_ssp=.+?&vld=.+?,vid:([^,]+)/];
  for (const regex of regexList) {
    const match = url.match(regex);
    if (match) return match[1];
  }
}
