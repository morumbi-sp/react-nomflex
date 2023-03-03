import { useLocation } from 'react-router-dom';

function Search() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get('keyword');
  console.log(keyword);

  return null;
}

export default Search;
