export const http = {
  async get(url: string) {
    const response = await fetch(url, { method: 'GET' });
    return await response.json();
  },

  async post(url: string, payload?: Record<string, any>) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload ?? {}),
    });
    return await response.json();
  },
};
