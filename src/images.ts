import { API_URL } from './config';


export function imageSrc(url: string): string {
  return url.startsWith('/') ? `${API_URL}${url}` : url;
}