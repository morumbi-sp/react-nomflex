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

function Home() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');

  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ['movies', 'nowPlaying'],
    fetchNowPlayingMovie
  );

  const backDropImgIndex = 1;
  const clickedMovieId = bigMovieMatch?.params.movieId;
  const clickedMovieData =
    bigMovieMatch &&
    data?.results.find((movie) => movie.id === Number(clickedMovieId));
  console.log(clickedMovieData?.backdrop_path);

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
