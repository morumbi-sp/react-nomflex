import { motion } from 'framer-motion';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { allApiDataMovie, category } from '../atoms';
import { makeImagePath } from '../util';

interface PropsI {
  scrollY: number;
}

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
  font-size: 40px;
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

function BigBox({ scrollY }: PropsI) {
  const history = useHistory();
  //   const { scrollY } = useScroll();
  const categoryValue = useRecoilValue(category);
  const bigMovieMatch = useRouteMatch<{ movieId: string }>('/movies/:movieId');
  const allData = useRecoilValue(allApiDataMovie);
  console.log(scrollY);

  const clickedMovieId = bigMovieMatch?.params.movieId;
  const clickedMovieData =
    bigMovieMatch &&
    allData?.find((movie) => movie.id === Number(clickedMovieId));

  const onOutsideClicked = () => {
    history.push(`/`);
  };

  return (
    <>
      <Overlay
        onClick={onOutsideClicked}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <BigMovie
        layoutId={categoryValue + clickedMovieId}
        style={{
          top: scrollY + 75,
        }}
      >
        <BigCover bgphoto={makeImagePath(clickedMovieData?.backdrop_path!)} />
        <BigTitle>{clickedMovieData?.title}</BigTitle>
        <BigOverview>{clickedMovieData?.overview}</BigOverview>
      </BigMovie>
    </>
  );
}

export default BigBox;
