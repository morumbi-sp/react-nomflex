export const API_KEY = '5d058213508c42de1e97cd1ebdbe63f3';

export const getMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  );
  const json = await response.json();
  return json;
};
