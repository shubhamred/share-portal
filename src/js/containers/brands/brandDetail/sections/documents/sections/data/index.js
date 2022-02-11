/* eslint-disable import/prefer-default-export */
export const DocumentStatuses = {
  VERIFIED: 'Verified',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending'
};

export const MoreMenuOptions = {
  MOVE_FILES: 'Move file',
  UPDATE_STATUS: 'Update status',
  RUN_FINBIT: 'Run finbit',
  RUN_PERFIOS: 'Run perfios',
  DELETE: 'Delete'
};

const commonDocOptions = [
  {
    label: MoreMenuOptions.MOVE_FILES
  },
  {
    label: MoreMenuOptions.UPDATE_STATUS,
    subList: [...Object.values(DocumentStatuses)]
  }
];

export const MoreMenuList = [
  ...commonDocOptions,
  {
    label: MoreMenuOptions.RUN_FINBIT
  }
];

export const GSTMoreMenuList = [
  ...commonDocOptions,
  {
    label: MoreMenuOptions.RUN_PERFIOS
  }
];

export const DocumentStatusColors = {
  Verified: 'invert(65%) sepia(60%) saturate(427%) hue-rotate(99deg) brightness(92%) contrast(86%)',
  Approved: 'invert(22%) sepia(54%) saturate(3684%) hue-rotate(228deg) brightness(104%) contrast(74%)',
  Rejected: 'invert(47%) sepia(9%) saturate(4794%) hue-rotate(314deg) brightness(88%) contrast(114%)',
  Pending: 'invert(83%) sepia(0%) saturate(1078%) hue-rotate(239deg) brightness(95%) contrast(93%)'
};
