import { motion, AnimatePresence, Variants, useScroll } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { fetchNowPlayingMovie, IGetMoviesResult } from '../api';
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
  justify-content: center;
`;

const SliderNowPlaying = styled(motion.div)`
  /* position: relative;
  top: 0px; */
`;

const CategoryName = styled.div`
  font-size: 23px;
  font-weight: 600;
  color: ${(props) => props.theme.white.darker};
  margin-bottom: 10px;
  margin-left: 15px;
`;

const NextBtn = styled(motion.div)`
  z-index: 99;
  height: 145px;
  width: 30px;
  top: 30;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  svg {
    height: 30px;
    fill: white;
  }
`;
const PrevBtn = styled(NextBtn)`
  left: 0;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  /* position: absolute; */
  width: 100%;
  padding: 0 5px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 145px;
  margin-bottom: 10px;
  font-size: 22px;
  color: black;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: -43% center;
  }
  &:last-child {
    transform-origin: 143% center;
  }
`;

const Info = styled(motion.div)`
  padding: 12px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 16px;
    color: ${(props) => props.theme.white.darker};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: scrollY.get() + 50;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(to top, black, transparent),
    url(${(props) => props.bgphoto});
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 50px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  font-size: 15px;
  color: ${(props) => props.theme.white.lighter};
  padding: 30px;
  position: relative;
  top: -60px;
`;

const hoverVariants = {
  hover: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
};

const rowVariants: Variants = {
  hidden: { x: window.innerWidth + 10 },
  visible: { x: 0 },
  exit: { x: -window.innerWidth - 10 },
};

const boxVariants: Variants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.4, duration: 0.2, type: 'tween' },
  },
};

const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.4, duration: 0.2, type: 'tween' },
  },
};

function Home() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');

  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    fetchNowPlayingMovie
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isRevers, setIsRevers] = useState(false);

  const backDropImgIndex = 1;
  const offset = 6;
  const clickedMovieId = bigMovieMatch?.params.movieId;
  const clickedMovieData =
    bigMovieMatch &&
    data?.results.find((movie) => movie.id === Number(clickedMovieId));
  console.log(clickedMovieData?.backdrop_path);

  const changeDirection = (event: React.MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    setIsRevers(id === 'next' ? false : true);
  };

  const increaseIndex = (event: React.MouseEvent<HTMLDivElement>) => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data?.results.length ?? 0;
    const pages = Math.floor(totalMovies / offset) - 1;
    const id = event.currentTarget.id;
    setIndex((prevIdx) => {
      if (id === 'next') {
        return prevIdx < pages ? prevIdx + 1 : 0;
      } else if (id === 'prev') {
        return prevIdx > 0 ? prevIdx - 1 : pages;
      } else return 0;
    });
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOutsideClicked = () => {
    history.push(`/`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[1].backdrop_path ?? '')}>
            <Container>
              <Title>{data?.results[backDropImgIndex].title}</Title>
              <Overview>{data?.results[backDropImgIndex].overview}</Overview>
            </Container>
          </Banner>
          <SliderContainer>
            <SliderNowPlaying variants={hoverVariants} whileHover='hover'>
              <CategoryName>NOW PLAYING </CategoryName>
              <NextBtn
                id='next'
                variants={hoverVariants}
                onClick={increaseIndex}
                onMouseEnter={changeDirection}
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'>
                  <path d='M246.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 41.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z' />
                </svg>
              </NextBtn>
              <PrevBtn
                id='prev'
                variants={hoverVariants}
                onClick={increaseIndex}
                onMouseEnter={changeDirection}
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'>
                  <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
                </svg>
              </PrevBtn>

              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial={isRevers ? 'exit' : 'hidden'}
                  animate='visible'
                  exit={isRevers ? 'hidden' : 'exit'}
                  transition={{ type: 'tween', duration: 1 }}
                  key={index}
                >
                  {data?.results
                    .filter((_, idx) => idx !== backDropImgIndex)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        onClick={() => onBoxClicked(movie.id)}
                        bgphoto={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          'w400'
                        )}
                        key={movie.id}
                        layoutId={movie.id.toString()}
                        variants={boxVariants}
                        transition={{ type: 'tween', duration: 0.2 }}
                        initial='normal'
                        whileHover='hover'
                      >
                        <Info
                          variants={infoVariants}
                          transition={{ type: 'tween', duration: 0.2 }}
                        >
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </SliderNowPlaying>
            <Slider apiData={data} />
          </SliderContainer>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOutsideClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={clickedMovieId}
                  style={{
                    top: scrollY.get() + 50,
                  }}
                >
                  <BigCover
                    bgphoto={makeImagePath(clickedMovieData?.backdrop_path!)}
                  />
                  <BigTitle>{clickedMovieData?.title}</BigTitle>
                  <BigOverview>{clickedMovieData?.overview}</BigOverview>
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}{' '}
    </Wrapper>
  );
}

export default Home;
