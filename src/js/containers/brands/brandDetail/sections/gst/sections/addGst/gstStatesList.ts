import { startCase } from 'lodash';

export const GstStateCode: { [key: string]: number } = {
  JAMMU_AND_KASHMIR: 1,
  HIMACHAL_PRADESH: 2,
  PUNJAB: 3,
  CHANDIGARH: 4,
  UTTARAKHAND: 5,
  HARYANA: 6,
  DELHI: 7,
  RAJASTHAN: 8,
  UTTAR_PRADESH: 9,
  BIHAR: 10,
  SIKKIM: 11,
  ARUNACHAL_PRADESH: 12,
  NAGALAND: 13,
  MANIPUR: 14,
  MIZORAM: 15,
  TRIPURA: 16,
  MEGHLAYA: 17,
  ASSAM: 18,
  WEST_BENGAL: 19,
  JHARKHAND: 20,
  ODISHA: 21,
  CHATTISGARH: 22,
  MADHYA_PRADESH: 23,
  GUJARAT: 24,
  DADRA_AND_NAGAR_HAVELI_AND_DAMAN_AND_DIU_NEWLY_MERGED_UT: 26,
  MAHARASHTRA: 27,
  ANDHRA_PRADESHBEFORE_DIVISION: 28,
  KARNATAKA: 29,
  GOA: 30,
  LAKSHWADEEP: 31,
  KERALA: 32,
  TAMIL_NADU: 33,
  PUDUCHERRY: 34,
  ANDAMAN_AND_NICOBAR_ISLANDS: 35,
  TELANGANA: 36,
  ANDHRA_PRADESH_NEWLY_ADDED: 37,
  LADAKH_NEWLY_ADDED: 38
};

export const getStateName: (arg: number) => string = (stateCode) => startCase(
  Object.keys(GstStateCode).find((key) => GstStateCode[key] === stateCode)
);
