import { IGetMoviesResult } from '../api';

interface SliderProps {
  apiData?: IGetMoviesResult;
}

function Slider({ apiData }: SliderProps) {
  console.log(apiData);
  return <div>hi</div>;
}

export default Slider;
