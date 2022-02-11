const DealPerformanceStatus = {
  UNDERPERFORMING: 'Underperforming',
  OUTPERFORMING: 'Outperforming',
  ON_TRACK: 'On Track',
  ON_TRACK_50: 'On Track 50% - 100%',
  DEFAULTED: 'Defaulted',
  UNDERPERFORMED: 'Underperformed',
  OUTPERFORMED: 'Outperformed',
  AS_PROJECTED: 'As Projected'
};

export default DealPerformanceStatus;

export const resourceTypes = {
  CUSTOMER: 'CUSTOMER',
  BRAND: 'BRAND',
  APPLICATION: 'APPLICATION',
  GST: 'GST',
  PATRON: 'Patron',
  NBFC: 'NBFC'
};

export const DealVisibility = {
  NOT_VISIBLE: 'Not Visible',
  TEAM: 'Team',
  LIVE: 'Live'
};

export const InvestmentTypes = {
  INDIVIDUAL: 'Individual',
  COMPANY: 'Company'
};

export const CompanyType = {
  BRAND: 'Brand',
  INSTITUTIONAL_INVESTOR: 'InstitutionalInvestor'
};

export const EntityTypes = {
  Proprietorship: 'Proprietorship',
  PARTNERSHIP: 'Partnership',
  LLP: 'LLP',
  PRIVATE_LIMITED: 'Private Limited',
  PUBLIC_LIMITED: 'Public Limited',
  HUF: 'HUF'
};
