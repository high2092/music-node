export const http = {
  async get(url: string, props?: RequestInit) {
    props ??= {};
    const response = await fetch(url, { method: 'GET', ...props });
    return response;
  },

  async post(url: string, payload?: Record<string, any>) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload ?? {}),
    });

    return response;
  },
};

export function handleUnauthorized() {
  location.href = '/api/oauth/kakao';
}
