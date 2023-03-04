import { IGetMoviesResult } from '../api';

interface SliderProps {
  apiData?: IGetMoviesResult;
}

function Slider({ apiData }: SliderProps) {
  return <div style={{ fontSize: '200px' }}>hi</div>;
}

export default Slider;
