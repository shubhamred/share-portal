import { reduce } from 'lodash';

export const getSumOfData = (datas = [], key) => reduce(
  datas,
  (sum, value) => sum + Number(value[key]),
  0
);
