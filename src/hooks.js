import fetch from 'node-fetch';

export const handle = async ({ request, resolve }) => {
  if (!globalThis.fetch) {
    globalThis.fetch = fetch;
  }

  const response = await resolve(request);
  return response;
};
