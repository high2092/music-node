export function getCookie(key: string) {
  let matches = document.cookie.match(new RegExp('(?:^|; )' + key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value}`;
}
