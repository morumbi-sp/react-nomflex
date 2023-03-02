import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult } from '../api';
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
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  width: 700px;
`;

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
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
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 12px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

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
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const backDropImgIndex = 1;
  const offset = 6;

  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = data?.results.length ?? 0;
    const pages = Math.floor(totalMovies / offset) - 1;
    setIndex((prevIdx) => (prevIdx < pages ? prevIdx + 1 : 0));
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[1].backdrop_path ?? '')}
          >
            <Title>{data?.results[backDropImgIndex].title}</Title>
            <Overview>{data?.results[backDropImgIndex].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: 'tween', duration: 1 }}
                key={index}
              >
                {data?.results
                  .filter((_, idx) => idx !== backDropImgIndex)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      bgphoto={makeImagePath(
                        movie.backdrop_path || movie.poster_path,
                        'w400'
                      )}
                      key={movie.id}
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
          </Slider>
        </>
      )}{' '}
    </Wrapper>
  );
}

export default Home;
