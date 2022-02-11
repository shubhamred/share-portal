export const GSTStatus = {
  IN_PROGRESS: 'In Progress',
  SUCCESS: 'Success',
  FAILURE: 'Failure'
};

export const isVerified: (arg: string) => boolean = (status = '') => {
  const verifiedStatus = [GSTStatus.SUCCESS, GSTStatus.IN_PROGRESS];
  return verifiedStatus.includes(status);
};
