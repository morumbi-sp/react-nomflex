export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

const BASE_MOVIE_URL = 'https://api.themoviedb.org/3';

const API_KEY = '5d058213508c42de1e97cd1ebdbe63f3';

export const fetchNowPlayingMovie = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};

export const fetchTopLatedMovie = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/movie/top_rated?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};
export const fetchPopularMovie = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/movie/popular?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};
export const fetchUpcomingMovie = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/movie/upcoming?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};

export const fetchTopRatedTv = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/tv/top_rated?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};
export const fetchAiringTodayTv = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/tv/airing_today?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};
export const fetchPopularTv = async () => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/tv/popular?api_key=${API_KEY}&language=ko&page=1`
  );
  const json = await response.json();
  return json;
};
export const fetchSearchMovies = async (keyword: string) => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/search/movie?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
  );
  const json = await response.json();
  return json;
};
export const fetchSearchTvs = async (keyword: string) => {
  const response = await fetch(
    `${BASE_MOVIE_URL}/search/tv?api_key=${API_KEY}&language=ko&query=${keyword}&page=1&include_adult=false`
  );
  const json = await response.json();
  return json;
};
