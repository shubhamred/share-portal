import { useHistory } from 'react-router-dom';

// provides methods to manage hash feature in URL.
const useHashRouting = () => {
  const history = useHistory();

  const hashMaker = (data = [], hashIndex = 2) => {
    let pathName = decodeURIComponent(history.location.pathname);
    const ind = pathName.indexOf('#');
    if (ind >= 0) {
      pathName = pathName.slice(0, ind);
    }
    let hash = '';
    for (let index = hashIndex; index < data.length; index += 1) {
      const element = data[index];
      hash = hash === ''
        ? element.title.replace(/ /g, '_').toLowerCase()
        : `${hash}-${element.title.replace(/ /g, '_').toLowerCase()}`;
    }
    if (typeof window !== 'undefined') {
      history.replace(`${pathName}#${hash}`);
    }
  };

  return [hashMaker];
};

export default useHashRouting;
