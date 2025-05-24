import { BASE_URL } from '../App';

export async function request(path, opts = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  // json-server returns empty string for DELETE; protect with fallback
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : null;
}
