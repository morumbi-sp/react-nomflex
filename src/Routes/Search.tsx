import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { fetchSearchMovies, fetchSearchTvs, IGetMoviesResult } from '../api';
import { slideCnt } from '../atoms';
import { makeImagePath } from '../util';

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryName = styled.div`
  font-size: 23px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${(props) => props.theme.white.darker};
  margin-bottom: 10px;
  margin-left: 15px;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
`;

const Container = styled.div`
  /* position: absolute; */
  margin-top: 100px;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string; offset: number }>`
  display: block;
  float: left;
  margin: 0.3rem;
  width: 250px;
  height: 140px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: top;
  font-size: 4rem;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
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

function Search() {
  const offset = useRecoilValue(slideCnt);
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get('keyword');

  const {
    isLoading: movieLoading,
    data: movieData,
    refetch: refetchMovies,
  } = useQuery<IGetMoviesResult>(['movies', 'searchResults'], () =>
    keyword ? fetchSearchMovies(keyword) : Promise.resolve(null)
  );
  const {
    isLoading: tvLoading,
    data: tvData,
    refetch: refetchTvs,
  } = useQuery<IGetMoviesResult>(['tvs', 'searchResults'], () =>
    keyword ? fetchSearchTvs(keyword) : Promise.resolve(null)
  );
  useEffect(() => {
    refetchMovies();
    refetchTvs();
  }, [keyword]);

  const loading = movieLoading || tvLoading;
  return (
    <Wrap>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <AnimatePresence initial={false}>
          <Container>
            <CategoryName>영화 검색 결과</CategoryName>
            {movieData?.results
              .filter((a) => a.poster_path !== null)
              .map((movie) => (
                <Box
                  bgphoto={makeImagePath(
                    movie.backdrop_path || movie.poster_path,
                    'w400'
                  )}
                  key={'search' + movie.id}
                  variants={boxVariants}
                  transition={{ type: 'tween', duration: 0.2 }}
                  offset={offset}
                  initial='normal'
                  whileHover='hover'
                >
                  <Info
                    variants={infoVariants}
                    transition={{ type: 'tween', duration: 0.2 }}
                  >
                    <h4>{movie.title || movie.name}</h4>
                  </Info>
                </Box>
              ))}{' '}
          </Container>
          <Container>
            <CategoryName>TV 검색 결과</CategoryName>
            {tvData?.results
              .filter((a) => a.poster_path !== null)
              .map((movie) => (
                <Box
                  bgphoto={makeImagePath(
                    movie.backdrop_path || movie.poster_path,
                    'w400'
                  )}
                  key={'search' + movie.id}
                  variants={boxVariants}
                  transition={{ type: 'tween', duration: 0.2 }}
                  offset={offset}
                  initial='normal'
                  whileHover='hover'
                >
                  <Info
                    variants={infoVariants}
                    transition={{ type: 'tween', duration: 0.2 }}
                  >
                    <h4>{movie.title || movie.name}</h4>
                  </Info>
                </Box>
              ))}{' '}
          </Container>
        </AnimatePresence>
      )}{' '}
    </Wrap>
  );
}

export default Search;
