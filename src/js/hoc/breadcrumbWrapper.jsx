/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useHashRouting from '../hooks/useHashRouting';

const WithBreadcrumb = (WrappedComponent, defaultArray = [], hashIndex = 2) => function (props) {
  const [hashMaker] = useHashRouting();
  const history = useHistory();

  const [BreadcrumbsArray, setBreadcrumbsArray] = useState(defaultArray);

  const setBreadcrumbsData = (
    title,
    index,
    clearPast = false,
    functions = () => {},
    chageURL = false
  ) => {
    setBreadcrumbsArray((pastBreadcrumbsArray) => {
      const mData = [...pastBreadcrumbsArray];
      const ind = mData.findIndex((list) => list.level === index);
      if (ind >= 0) {
        mData[ind].title = title || '';
        mData[ind].functions = functions;
      } else {
        mData.push({ title, level: index, functions });
      }

      const sortData = mData.sort((a, b) => {
        if (a.level > b.level) {
          return 1;
        }
        if (b.level > a.level) {
          return -1;
        }
        return 0;
      });

      if (clearPast) {
        if (chageURL) {
          hashMaker(sortData.filter((list) => list.level <= index), hashIndex);
        }
        return sortData.filter((list) => list.level <= index);
      }
      if (chageURL) {
        hashMaker(sortData, hashIndex);
      }
      return sortData;
    });
  };

  const defaultHashHandler = () => {
    const { hash, pathname } = history.location;
    const pathName = decodeURIComponent(pathname).split('#');
    let listOfHash = [];
    if (pathName.length >= 2) {
      listOfHash = pathName[1].split('-');
    } else {
      listOfHash = hash.replace('#', '').split('-');
    }
    if (listOfHash?.length) {
      for (let index = 0; index < listOfHash.length; index += 1) {
        const element = listOfHash[index];
        if (element !== '') {
          if (listOfHash.length - 1 === index) {
            setBreadcrumbsData(element.replace(new RegExp('_', 'g'), ' '), index + hashIndex, false, () => {}, true);
          } else {
            setBreadcrumbsData(element.replace(new RegExp('_', 'g'), ' '), index + hashIndex, false, () => {}, false);
          }
        }
      }
    }
  };

  return (
    <WrappedComponent
      {...props}
      BreadcrumbsArray={BreadcrumbsArray}
      setBreadcrumbsData={setBreadcrumbsData}
      defaultHashHandler={defaultHashHandler}
    />
  );
};

export default WithBreadcrumb;
