const BASE_URL = 'https://image.tmdb.org/t/p';

export function makeImagePath(path: string, format = 'original') {
  return `${BASE_URL}/${format}/${path}`;
}
