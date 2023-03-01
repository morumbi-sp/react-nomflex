import { useQuery } from 'react-query';
import { getMovies } from '../api';

function Home() {
  const { isLoading, data } = useQuery(['movies', 'nowPlaying'], getMovies);
  return <div style={{ backgroundColor: 'white', height: '200vh' }}>home</div>;
}

export default Home;
