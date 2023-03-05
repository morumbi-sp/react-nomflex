import { AnimatePresence, useScroll } from 'framer-motion';
import { useQuery } from 'react-query';
import { useRouteMatch } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  fetchAiringTodayTv,
  fetchPopularTv,
  fetchTopRatedTv,
  IGetMoviesResult,
} from '../api';
import { allApiDataTv } from '../atoms';
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

function Tv() {
  const { scrollY } = useScroll();
  const scrollYGet = scrollY.get();
  const setAllData = useSetRecoilState(allApiDataTv);

  const bigMovieMatch = useRouteMatch<{ tvId: string }>('/tv/tvs/:tvId');

  const { isLoading: topLateTvLoading, data: topLateTvData } =
    useQuery<IGetMoviesResult>(['tvs', 'topLate'], fetchTopRatedTv);
  const { isLoading: airingTodayTvLoading, data: airingTodayTvData } =
    useQuery<IGetMoviesResult>(['tvs', 'airingToday'], fetchAiringTodayTv);
  const { isLoading: popularTvLoading, data: popularTvData } =
    useQuery<IGetMoviesResult>(['tvs', 'popular'], fetchPopularTv);

  const allData = [
    ...(topLateTvData?.results ?? []),
    ...(airingTodayTvData?.results ?? []),
    ...(popularTvData?.results ?? []),
  ];

  setAllData(allData);

  const backDropImgIndex = 0;

  const loading = topLateTvLoading || airingTodayTvLoading || popularTvLoading;

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              topLateTvData?.results[backDropImgIndex].backdrop_path ?? ''
            )}
          >
            <Container>
              <Title>{topLateTvData?.results[backDropImgIndex].name}</Title>
              <Overview>
                {topLateTvData?.results[backDropImgIndex].overview}
              </Overview>
            </Container>
          </Banner>
          <SliderContainer>
            <Slider
              apiData={topLateTvData}
              pageName={'tv/tvs'}
              categoryName={'top rated'}
            />
            <Slider
              apiData={airingTodayTvData}
              pageName={'tv/tvs'}
              categoryName={'airing today'}
            />
            <Slider
              apiData={popularTvData}
              pageName={'tv/tvs'}
              categoryName={'popular'}
            />
          </SliderContainer>

          <AnimatePresence>
            {bigMovieMatch ? <BigBox page={'tv'} scrollY={scrollYGet} /> : null}
          </AnimatePresence>
        </>
      )}{' '}
    </Wrapper>
  );
}

export default Tv;
