import { useQuery } from 'react-query';
import { getMovies, IGetMoviesResult } from '../api';

function Home() {
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  return <div style={{ backgroundColor: 'white', height: '200vh' }}>home</div>;
}

export default Home;
