// API configuration and URL resolver
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function getApiUrl(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
