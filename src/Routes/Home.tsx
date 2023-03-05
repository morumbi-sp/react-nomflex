import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  fetchNowPlayingMovie,
  fetchPopularMovie,
  fetchTopLatedMovie,
  fetchUpcomingMovie,
  IGetMoviesResult,
  IMovie,
} from '../api';
import { allApiDataMovie, category } from '../atoms';
import BigBox from '../components/BigBox';
import Slider from '../components/Slider';
import { makeImagePath } from '../util';

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100vw;
  height: 0;
  padding-bottom: 50%;
  position: relative;
`;

const Container = styled.div`
  position: absolute;
  bottom: 35%;
  margin-left: 50px;
`;

const Title = styled.h2`
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 17px;
  width: 500px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const scrollYGet = scrollY.get();
  const setAllData = useSetRecoilState(allApiDataMovie);

  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');

  const { isLoading: nowPlayingMovieLoading, data: nowPlayingMovieData } =
    useQuery<IGetMoviesResult>(['movies', 'nowPlaying'], fetchNowPlayingMovie);

  const { isLoading: topLatedMovieLoading, data: topLatedMovieData } =
    useQuery<IGetMoviesResult>(['movies', 'topLated'], fetchTopLatedMovie);

  const { isLoading: popularMovieLoading, data: popularMovieData } =
    useQuery<IGetMoviesResult>(['movies', 'popular'], fetchPopularMovie);

  const { isLoading: upcomingMovieLoading, data: upcomingMovieData } =
    useQuery<IGetMoviesResult>(['movies', 'upcoming'], fetchUpcomingMovie);

  const allData = [
    ...(nowPlayingMovieData?.results ?? []),
    ...(topLatedMovieData?.results ?? []),
    ...(popularMovieData?.results ?? []),
    ...(upcomingMovieData?.results ?? []),
  ];

  setAllData(allData);

  const backDropImgIndex = 1;
  const clickedMovieId = bigMovieMatch?.params.movieId;
  const clickedMovieData =
    bigMovieMatch &&
    allData?.find((movie) => movie.id === Number(clickedMovieId));

  const loading =
    nowPlayingMovieLoading ||
    topLatedMovieLoading ||
    popularMovieLoading ||
    upcomingMovieLoading;

  const onOutsideClicked = () => {
    history.push(`/`);
  };

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlayingMovieData?.results[1].backdrop_path ?? ''
            )}
          >
            <Container>
              <Title>
                {nowPlayingMovieData?.results[backDropImgIndex].title}
              </Title>
              <Overview>
                {nowPlayingMovieData?.results[backDropImgIndex].overview}
              </Overview>
            </Container>
          </Banner>
          <SliderContainer>
            <Slider
              apiData={nowPlayingMovieData}
              pageName={'movies'}
              categoryName={'now playing'}
            />
            <Slider
              apiData={topLatedMovieData}
              pageName={'movies'}
              categoryName={'top late'}
            />
            <Slider
              apiData={popularMovieData}
              pageName={'movies'}
              categoryName={'popular'}
            />
            <Slider
              apiData={upcomingMovieData}
              pageName={'movies'}
              categoryName={'upcoming'}
            />
          </SliderContainer>

          <AnimatePresence>
            {bigMovieMatch ? <BigBox scrollY={scrollYGet} /> : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
