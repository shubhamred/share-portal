import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';

// company
import CompanyListing from 'app/containers/companies/companyListing';
import CompanyDetail from 'app/containers/companies/companyDetail';

// brands
import Repayments from 'app/containers/repayments';
import ProductListing from 'app/containers/products/productListing';
import ProductDetail from 'app/containers/products/productDetail';
import BrandDetail from '../../containers/brands/brandDetail';
import BrandList from '../../containers/brands/brandList';
// patrons
import PatronDetail from '../../containers/patrons/patronDetail';
import PatronList from '../../containers/patrons/patronList';

// deals
import DealList from '../../containers/deals/dealList';
import DealDetail from '../../containers/deals/dealDetail';
import InvestmentList from '../../containers/deals/investments';

// loyalty
import LoyaltyDashboard from '../../containers/loyalty';
import UpdateReward from '../../containers/loyalty/rewards/updateReward';

// applications
import ApplicationListing from '../../containers/applications/applicationListing';
import ApplicationDetail from '../../containers/applications/applicationDetail';

// users
import UserManagement from '../../containers/users';
import DocService from '../../containers/docsService';

// NBFC partners
import PartnersListing from '../../containers/partners/partnersListing';
import PartnerDetail from '../../containers/partners/partnerDetail';

const privateRoutes = [
  {
    path: '/brands/:brandId',
    title: 'Brand Detail',
    icon: DashboardIcon,
    component: BrandDetail,
    sidebar: false,
    category: 'Brands'
  },
  {
    path: '/brands',
    title: 'Brands',
    icon: <img src="/assets/dribbble.svg" alt="Brands" />,
    component: BrandList,
    sidebar: true,
    divider: true,
    category: 'Brands'
  },
  {
    path: '/patrons/:patronId',
    title: 'Patron Detail',
    icon: DashboardIcon,
    component: PatronDetail,
    sidebar: false,
    category: 'Patrons'
  },
  {
    path: '/patrons',
    title: 'Patrons',
    icon: <img src="/assets/Vector.svg" alt="Patrons" />,
    component: PatronList,
    sidebar: true,
    divider: true,
    category: 'Patrons'
  },
  {
    path: '/companies/:companyId',
    title: 'Investment Firms',
    icon: <img src="/assets/university.svg" alt="Brands" />,
    component: CompanyDetail,
    sidebar: false,
    category: 'Patrons'
  },
  {
    path: '/companies',
    title: 'Investment Entities',
    icon: <img src="/assets/university.svg" alt="Brands" />,
    component: CompanyListing,
    sidebar: true,
    divider: true,
    category: 'Patrons'
  },
  {
    path: '/applications/:applicationId',
    title: 'Applications Detail',
    icon: <img src="/assets/applications.svg" alt="Applications" />,
    component: ApplicationDetail,
    sidebar: false,
    category: 'Brands'
  },
  {
    path: '/applications',
    title: 'Applications',
    icon: <img src="/assets/applications.svg" alt="Applications" />,
    component: ApplicationListing,
    sidebar: true,
    category: 'Brands'
  },
  {
    path: '/deals',
    title: 'Deals',
    icon: <img src="/assets/bolt.svg" alt="Deals" />,
    component: DealList,
    sidebar: true,
    divider: true,
    category: 'Investments'
  },
  {
    path: '/deals/investments',
    title: 'Investments',
    icon: <img src="/assets/usd-circle.svg" alt="Investments" />,
    component: InvestmentList,
    sidebar: true,
    category: 'Investments'
  },
  {
    path: '/deals/:dealId',
    title: 'Deal Detail',
    icon: DashboardIcon,
    component: DealDetail,
    sidebar: false,
    category: 'Investments'
  },
  // {
  //   path: '/loyalty/points',
  //   title: 'Loyalty Points',
  //   icon: DashboardIcon,
  //   components: PointList,
  //   sidebar: true
  // },
  {
    path: '/loyalty/rewards/:rewardId',
    title: 'Loyalty',
    icon: DashboardIcon,
    component: UpdateReward,
    sidebar: false,
    category: 'Others'
  },
  // {
  //   path: '/loyalty/rewards',
  //   title: 'Loyalty Rewards',
  //   icon: DashboardIcon,
  //   components: RewardList,
  //   sidebar: true
  // },
  {
    path: '/repayments',
    title: 'Patron Payouts',
    icon: <img src="/assets/money-withdraw.svg" alt="repayments" />,
    component: Repayments,
    sidebar: true,
    divider: true,
    category: 'Patrons'
  },
  {
    path: '/partners',
    title: 'NBFC Partners',
    icon: <img src="/assets/university.svg" alt="partners" />,
    component: PartnersListing,
    sidebar: true,
    category: 'Patrons'
  },
  {
    path: '/partners/:partnerId',
    title: 'Partner',
    icon: <img src="/assets/university.svg" alt="Brands" />,
    component: PartnerDetail,
    sidebar: false,
    category: 'Patrons'
  },
  {
    path: '/loyalty',
    title: 'Loyalty - LMS',
    icon: <img src="/assets/gift.svg" alt="Loyalty" />,
    component: LoyaltyDashboard,
    sidebar: true,
    divider: true,
    category: 'Others'
  },
  {
    path: '/products/:productId',
    title: 'Products',
    icon: <img src="/assets/productSvg.svg" alt="Loyalty" />,
    component: ProductDetail,
    sidebar: false,
    category: 'Others'
  },
  {
    path: '/products',
    title: 'Products',
    icon: <img src="/assets/product.svg" alt="Loyalty" />,
    component: ProductListing,
    sidebar: true,
    divider: true,
    category: 'Others'
  },
  {
    path: '/user-manage',
    title: 'User Management',
    icon: <img src="/assets/users-alt.svg" alt="User Management" />,
    component: UserManagement,
    sidebar: true,
    divider: true,
    category: 'Others'
  },
  {
    path: '/doc-service',
    title: 'Doc service',
    icon: <img src="/assets/file-info-alt.svg" alt="Doc Service" />,
    component: DocService,
    sidebar: true,
    category: 'Others'
  },
  { redirect: true, path: '/', to: '/patrons' }
];

export default privateRoutes;
