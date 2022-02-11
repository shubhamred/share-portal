/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Grid } from '@material-ui/core';
import { DialogComponent } from 'app/components';
import { formatDate, formatDateStandard, formatCurrency } from 'app/utils/utils';
import { getRevenueProjections } from 'app/containers/repayments/saga';
import { getApplicationsOfBrand } from 'app/containers/applications/saga';
import { getInvestments, getBusinessDetails, getAddressesV2 } from 'app/containers/deals/saga';
import { getApplicantList, getDealIntegrations, getAccounts } from 'app/containers/brands/saga';
import { getCompanies } from 'app/containers/companies/saga';
import { getPatrons, getAllDocsByFilter, getPatronDocPresignedUrl, postDocMetaData, removeFile } from 'app/containers/patrons/saga';
import FileUploader from 'app/containers/document/fileUploader';
import DocumentFile from 'app/components/singleDocument/Document';
import { DOC_VALIDATION_MARK } from 'app/utils/constants';
import { get, groupBy } from 'lodash';
import docList, { DealInvestmentStatus, DocType, Tabs as TabsList } from '../data/mockdata';
import ControlledAccordion from '../../../../../components/controlledAccordion';
import DetailForm from '../form';
import ErrorDetail from '../errorData';
import styles from '../styles.scss';
import CustomizedSteppers from '../../../../../components/stepper/stepper';
import MoneteryTable from './table/monetery';
import DsaTable from './table/dsa';
import ESignTableLinks from './table/eSignLinkTable';

class DocListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: 0,
      selectedDocType: {},
      dialogForm: false,
      errorDetailDialog: false,
      dialoagType: '',
      dialoagTitle: '',
      investorsListData: [],
      signedDocData: [],
      metaData: {},
      investmentData: [],
      investmentsIDs: [],
      formData: {},
      brandData: {},
      applicationData: {},
      brandOwnerData: [],
      brandAddresses: [],
      PGData: [],
      POSData: [],
      bankData: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.signedDocData && props.signedDocData) {
      return {
        signedDocData: { ...state.signedDocData, ...props.signedDocData }
      };
    }
    return null;
  }

  componentDidMount = () => {
    const { deal: dealData } = this.props;
    getBusinessDetails(dealData.brandId).then((res) => {
      this.setState({ brandData: res });
    });
    getApplicantList(dealData.brandId).then((res) => {
      this.setState({ brandOwnerData: res?.data || [] });
    });
    getAddressesV2(dealData.brandCode).then((res) => {
      this.setState({ brandAddresses: res?.data || [] });
    });
    getAccounts(dealData.brandCode).then((res) => {
      this.setState({ bankData: res?.data || [] });
    });
    getDealIntegrations(dealData.brandCode, dealData.applicationCode, dealData.dealCode).then((res) => {
      if (res?.data) {
        this.pgAndPosData(res?.data);
      }
    });
    getApplicationsOfBrand(dealData.brandId).then((res) => {
      if (res?.data?.length) {
        const applicationData = res.data.find((data) => data.applicationCode === dealData.applicationCode);
        if (applicationData) {
          this.setState({ applicationData });
        }
      }
    });
    this.getInvestorsList();
  };

  pgAndPosData = (data) => {
    if (data?.PG) {
      const PGData = Object.keys(data.PG).map((list) => ({
        name: list,
        category: 'PG',
        accountName: data.PG[list]?.accountName || '',
        accountNumber: data.PG[list]?.accountNumber || '',
        isPrimary: data.PG[list]?.isPrimary || false,
        split: data.PG[list]?.splitPercentage || 0,
        minContribution: data.PG[list]?.splitPercentage || 0
      }));
      this.setState({ PGData });
    }

    if (data?.POS) {
      const POSData = Object.keys(data.POS).map((list) => ({
        name: list,
        category: 'POS',
        accountName: data.POS[list]?.accountName || '',
        accountNumber: data.POS[list]?.accountNumber || '',
        isPrimary: data.POS[list]?.isPrimary || false,
        split: data.POS[list]?.splitPercentage || 0,
        minContribution: data.POS[list]?.splitPercentage || 0
      }));
      this.setState({ POSData });
    }
  };

  handleExpanded = ({ id, ...otherData }) => {
    if (id === this.state.expanded) {
      this.setState({ expanded: 0 });
      return;
    }
    this.setState({ expanded: id, selectedDocType: { id, ...otherData } });
  };

  // Get Company Data based on Company Code
  fetchData = (
    perPage,
    currentpage,
    companyCodeList = []
  ) => {
    const query = {
      // fields: 'businessName,companyCode,id,customerCompanies',
      where: {
        companyType: 'InstitutionalInvestor',
        companyCode: companyCodeList?.length ? { in: companyCodeList } : []
      },
      order: { createdAt: 'DESC' },
      includes: [
        'customerCompanies',
        'customerCompanies.customer'
      ]
    };
    const getCustomerData = (customerCompanies = []) => {
      if (customerCompanies.length > 0) {
        const authorisedSignatory = customerCompanies.find((cus) => cus.isAuthorizedSignatory);
        if (authorisedSignatory) {
          return authorisedSignatory?.customer || {};
        }
        return authorisedSignatory[0]?.customer || {};
      }
      return {};
    };
    getCompanies(perPage, currentpage + 1, '', '', undefined, query).then(
      (res) => {
        if (res.data) {
          const companyData = res.data?.map((company) => ({
            businessName: company.businessName,
            companyCode: company.companyCode,
            ...getCustomerData(company.customerCompanies || [])
          }));
          // eslint-disable-next-line react/no-access-state-in-setstate
          const mergedList = [...this.state.investorsListData, ...companyData];
          this.setState({ investorsListData: mergedList });
        }
      }
    );
  };

  getAllDocuments = () => {
    getAllDocsByFilter('INVESTMENT', this.state.investmentsIDs || [], [
      'MONETARY_COLLECTION',
      'MONETARY_COLLECTION_SIGNED'
    ]).then((invResponse) => {
      if (invResponse?.data) {
        if (groupBy(invResponse.data, 'docType')) {
          const { signedDocData = {} } = this.props;
          const filteredDocs = invResponse.data?.filter((data) => data.isArchived === false);
          this.setState({
            signedDocData: { ...groupBy(filteredDocs, 'docType'), ...signedDocData }
          });
        }
      }
    });
  };

  getInvestorsList = (query) => {
    const { id } = this.props.deal || {};
    const queryParam = {
      order: {
        createdAt: 'DESC'
      },
      fields: 'id,patronCode,status,amount,feePercentage,companyCode,investmentType',
      where: {
        status: {
          in: [
            DealInvestmentStatus.APPROVED,
            DealInvestmentStatus.DOC_INITIATED,
            DealInvestmentStatus.DOC_SIGNED,
            DealInvestmentStatus.INVESTED
          ]
        },
        dealId: id
      },
      take: query?.take || 20,
      page: query?.page || 1
    };

    getInvestments(queryParam).then((res) => {
      if (res?.data) {
        this.setState({ investmentData: res.data });
      }
      const investmentIDs = res.data?.map((cus) => cus.id);
      if (!investmentIDs || investmentIDs?.length < 1) {
        return;
      }
      this.setState({ investmentsIDs: investmentIDs, metaData: res?.meta }, () => {
        this.getAllDocuments();
      });

      // Filter out patron codes ( pick only those, who don;t have company code)
      const customersCodeArr = res.data?.filter((data) => (!data.companyCode && data.patronCode)).map((cus) => cus.patronCode);
      // Filter out company codes
      const entityCodeArr = res.data?.filter((data) => (data.companyCode)).map((cus) => cus.companyCode);

      // Get Customers Data based on Patron Code
      const customerParams = {
        fields: 'name,firstName,lastName,patronCode,id,pan,email',
        where: {
          patronCode: {
            in: customersCodeArr
          },
          isPatron: true
        },
        take: 50
      };
      getPatrons(customerParams).then((cusData) => {
        this.setState({ investorsListData: cusData?.data || [] }, () => {
          this.fetchData(50, 0, entityCodeArr);
        });
      }).catch(() => {
        this.fetchData(50, 0, entityCodeArr);
      });
    });
  };

  handleOpenFormDialog = async (data) => {
    const { deal: dealData } = this.props;
    const { brandData, brandAddresses, signedDocData, selectedDocType, applicationData } = this.state;

    const registeredAddress = brandAddresses.find((list) => list.addressType === 'Registered');
    const addressString = registeredAddress ? `${(registeredAddress.line1 || '')} ${(registeredAddress.line2 || '')}` : '';
    const { type } = selectedDocType || {};
    const selectedDocTypeData = (signedDocData[type] && signedDocData[type][0]) || {};

    let formData = {};
    switch (data.type) {
      case DocType.DebentureSubscription:
        formData = {
          brand_legal_name: brandData?.data?.legalName || '',
          brand_reg_address: addressString,
          brand_pan: brandData?.data?.pan || '',
          deal_fixed_yield_of_deb: dealData?.yield || '',
          deal_total_amount: formatCurrency(dealData?.dealAmount || 0) || '',
          deal_total_revenue_share: dealData?.revenueShare || '',
          deal_deb_series: dealData?.debentureSeries || '',
          deal_repayment_of_the_principle: dealData?.yield ? 100 / (100 + dealData.yield) : '',
          deal_repayment_of_interest: dealData?.yield ? dealData.yield / (100 + dealData.yield) : '',
          deal_total_no_of_deb: dealData?.dealAmount ? (dealData.dealAmount / 25000) : '',
          deal_purpose_of_fundraise: dealData?.shareText || '',
          baseRevenueAmount: formatCurrency(dealData?.baseRevenueAmount || 0) || '',
          deal_hyp_assets_detail_valuation_report: dealData?.hypothicationDetail || '',
          lowerCapRevenuePercentage: dealData?.lowerCapRevenuePercentage || '',
          upperCapRevenuePercentage: dealData?.upperCapRevenuePercentage || '',
          hard_threshold_amount: formatCurrency(applicationData?.hardThresholdAmount || 0) || '',
          soft_threshold_amount: formatCurrency(applicationData?.softThresholdAmount || 0) || '',
          disclousere_schedule: dealData?.agreementData?.disclosureSchedule || ''
        };
        break;
      case DocType.MoneteryAndCollection:
        formData = {
          brand_legal_name: brandData?.data?.legalName || '',
          deal_fixed_yield_of_deb: dealData?.yield || '',
          deal_total_amount: formatCurrency(dealData?.dealAmount || 0) || '',
          deal_total_revenue_share: dealData?.revenueShare || '',
          deal_repayment_of_principles: dealData?.yield ? 100 / (100 + dealData.yield) : '',
          deal_repayment_of_interest: dealData?.yield ? dealData.yield / (100 + dealData.yield) : '',
          deal_purpose_of_investment: applicationData?.fundingRequiredFor || ''
        };
        break;
      case DocType.DeedOfHypothication:
        formData = {
          hypothicated_property: dealData?.hypothicationDetail || '',
          no_of_deb: dealData?.dealAmount ? (dealData.dealAmount / 25000) : '',
          brand_legal_name: brandData?.data?.legalName || '',
          registered_address: addressString,
          brand_cin: brandData?.data?.cin || '',
          description: brandData?.data?.description || '',
          total_amount: formatCurrency(dealData?.dealAmount || 0) || '',
          hypothication_date: (selectedDocTypeData.createdAt && formatDate(selectedDocTypeData.createdAt)) || '-'
        };
        break;
      case DocType.DebentureTrustDeed:
        formData = {
          brand_legal_name: brandData?.data?.legalName || '',
          brand_reg_address: addressString,
          brand_cin: brandData?.data?.cin || '',
          brand_description: brandData?.data?.description || '',
          deb_series: dealData?.debentureSeries || '',
          no_of_deb: dealData?.dealAmount ? (dealData.dealAmount / 25000) : '',
          purpose_of_fund_raise: dealData?.shareText || '',
          total_amount: formatCurrency(dealData?.dealAmount || 0) || '',
          board_resolution_date: dealData?.agreementData?.boardResolutionDate ? formatDate(dealData.agreementData.boardResolutionDate) : '',
          EGM_MGT_date: dealData?.agreementData?.egmDate ? formatDate(dealData.agreementData.egmDate) : '',
          deb_trustee_agreement_date: dealData?.agreementData?.trusteeAgreementDate ? formatDate(dealData.agreementData.trusteeAgreementDate) : '',
          engagement_letter_date: dealData?.agreementData?.engagementLetterDate ? formatDate(dealData.agreementData.engagementLetterDate) : '',
          fixed_yield_of_deb: dealData?.yield || '',
          total_revenue_share: dealData?.revenueShare || '',
          repayment_of_the_principle: dealData?.yield ? 100 / (100 + dealData.yield) : '',
          repayment_of_interest: dealData?.yield ? dealData.yield / (100 + dealData.yield) : '',
          hypothicated_property: dealData?.hypothicationDetail || ''
        };
        break;
      default:
        break;
    }
    this.setState({ dialogForm: true, formData, dialoagType: data.type, dialoagTitle: data.name });
  };

  handleCloseFormDialog = () => this.setState({ dialogForm: false });

  formatRatio = (num) => num && Math.round(num);

  getDocCompletedRatio = (withText) => {
    const { dealDocValidation } = this.props;
    const { percentageComplete } = dealDocValidation;
    const percentage = this.formatRatio(percentageComplete);

    if (!percentage) return '';

    if (withText) {
      return `${percentage}% Done`;
    }
    return `${percentage}%`;
  };

  getDocStyles = () => {
    const { dealDocValidation } = this.props;
    const { percentageComplete } = dealDocValidation;
    return percentageComplete < DOC_VALIDATION_MARK ? styles.pendingText : styles.doneText;
  };

  getDocPercentage = () => {
    const { dealDocValidation } = this.props;
    const { percentageComplete } = dealDocValidation;
    return this.formatRatio(percentageComplete);
  };

  getSteps = ({ application }) => {
    const steps = [
      {
        label: this.getActiveStep({}) === 0 ? 'Information pending' : 'Information',
        isActive: true,
        children: (
          <div>
            <p className={styles.linkV2}>
              <span className={this.getDocStyles()}>
                {this.getDocCompletedRatio(true)}
              </span>
              <span
                onKeyPress={() => {}}
                role="button"
                tabIndex="-8"
                onClick={() => this.handleOpenFormDialog(application)}
              >
                Preview
              </span>
            </p>
          </div>
        )
      },
      {
        label: 'Document generation',
        isActive: false,
        children: <div>{/* <p className={styles.linkV2}>Generate documents</p> */}</div>
      },
      {
        label: 'Signing links',
        isActive: false,
        children: <div>{/* <p className={styles.linkV2}>Generate links</p> */}</div>
      },
      {
        label: 'E singing',
        isActive: false,
        children: (
          <div>
            <p className={styles.linkV2} />
          </div>
        )
      }
    ];
    return steps;
  };

  getStatusStyle = ({ type }) => {
    const { signedDocData = {} } = this.state;

    if (Object.keys(signedDocData || {}).length < 1 && this.getDocPercentage() < DOC_VALIDATION_MARK) {
      return styles.linkCreated;
    }

    if (this.getDocPercentage() >= DOC_VALIDATION_MARK && Object.keys(signedDocData || {}).length < 1) {
      return styles.signed;
    }

    switch (true) {
      case type !== DocType.MoneteryAndCollection && this.getFilesByDocType({ type })?.generatedFiles?.length > 0 && !this.isDocSignedByType(type):
        return styles.generated;
      case this.isDocSignedByType(type):
        return styles.signed;
      case type === DocType.MoneteryAndCollection:
        if (type === DocType.MoneteryAndCollection) {
          const { status } = this.props.deal || {};
          if (status === 'Initiate Document Signing') {
            return styles.linkCreated;
          }
        }
        return styles.generated;
      case this.isSigningPending(type):
        return styles.linkCreated;
      default:
        return styles.generated;
    }
  };

  isDocSignLinksGenerated = (type = '') => {
    const { signedDocData = {} } = this.state;
    const typeToCheck = type === DocType.MoneteryAndCollection ? type : `${type}_ESTAMP`;
    if (
      signedDocData[type]?.length > 0
      && get(signedDocData, `[${typeToCheck}][0].additionalData.leegalitySigners`)?.length
    ) {
      const signersData = get(signedDocData, `[${typeToCheck}][0].additionalData.leegalitySigners`);
      return signersData?.length > 0; // returns true if signers array is present.
    }
    return false;
  }

  isDocSignedByType = (type = '') => {
    const { signedDocData = {} } = this.state;
    const typeToCheck = type === DocType.MoneteryAndCollection ? type : `${type}_ESTAMP`;
    if (
      signedDocData[type]?.length > 0
      && get(signedDocData, `[${typeToCheck}][0].additionalData.leegalitySigners`)?.length
    ) {
      const signersData = get(signedDocData, `[${typeToCheck}][0].additionalData.leegalitySigners`);
      const unSignedData = signersData?.filter((signer) => signer.status !== 'Signed') || [];
      return unSignedData?.length < 1; // returns true if all the signers are with "Signed" status.
    }
    return false;
  }

  isLinksGenerated = (type = '') => {
    const { signedDocData = {} } = this.state;
    const typeToCheck = type === DocType.MoneteryAndCollection ? type : `${type}_ESTAMP`;
    if (
      signedDocData[type]?.length > 0
      && get(signedDocData, `[${typeToCheck}][0].additionalData.leegalitySigners`)?.length
    ) {
      return true;
    }
    return false;
  }

  isSigningDone = (type = '') => {
    const { signedDocData = {} } = this.state;
    return signedDocData[`${type}_SIGNED`]?.length > 0;
  }

  isStampingDone = (type = '') => {
    const { signedDocData = {} } = this.state;
    return signedDocData[`${type}_ESTAMP`]?.length > 0;
  }

  isSigningPending = (type = '') => !this.isDocSignedByType(type);

  getDocumentStatus = ({ type = '' }) => {
    const { signedDocData = {} } = this.state;

    if (Object.keys(signedDocData || {}).length < 1 && this.getDocPercentage() < DOC_VALIDATION_MARK) {
      return 'Information pending';
    }
    if (this.getDocPercentage() >= DOC_VALIDATION_MARK && Object.keys(signedDocData || {}).length < 1) {
      return 'Information completed';
    }
    if (this.isDocSignedByType(type)) {
      return 'Signing done';
    }

    if (this.isLinksGenerated(type) && this.isSigningPending(type)) {
      return 'Signing pending';
    }

    if (this.getFilesByDocType({ type })?.generatedFiles?.length > 0) {
      return 'Doc generated';
    }

    return 'Doc generated';
  }

  getActiveStep = ({ type = '' }) => {
    const { signedDocData = {} } = this.state;

    if (Object.keys(signedDocData || {}).length < 1 && this.getDocPercentage() < DOC_VALIDATION_MARK) {
      return 0;
    }

    if (this.isDocSignedByType(type)) {
      return 4;
    }

    if (this.isDocSignLinksGenerated(type)) {
      return 3;
    }

    if (this.isStampingDone(type) || this.getFilesByDocType({ type })?.generatedFiles?.length > 0) {
      return 2;
    }

    // for monetery status
    if (type === DocType.MoneteryAndCollection) {
      const { status } = this.props.deal || {};
      if (status === 'Initiate Document Signing') {
        return 2;
      }
      if (signedDocData[type]?.length > 0 && get(signedDocData, `[${type}][0].additionalData.leegalitySigners`)) {
        return 3;
      }
    }

    return 1;
  }

  getFilesByDocType = ({ type }) => {
    const { signedDocData = {} } = this.state;
    const generatedFiles = [];
    const uploadedFiles = [];
    Object.keys(signedDocData).forEach((key) => {
      if (key?.includes('STAMP') && key.includes(type)) {
        uploadedFiles.push(...signedDocData[key]);
        return;
      }
      if (key.includes(type)) {
        generatedFiles.push(...signedDocData[key]);
      }
    });
    return { generatedFiles, uploadedFiles };
  };

  getFilesByResourceId = (resourceId = '') => {
    const { signedDocData = {} } = this.state;
    const files = [];

    Object.keys(signedDocData).forEach((key) => {
      const currentResourceFiles = signedDocData[key]?.filter((data) => data.resourceId === resourceId);
      if (currentResourceFiles?.length) {
        files.push(...currentResourceFiles);
      }
    });
    return files;
  };

  getInvestmentId = (code = '', investmentType) => {
    const { investmentData } = this.state;
    const investmentId = investmentData?.find((item) => {
      if (investmentType === item.investmentType && item.companyCode === code) {
        return true;
      }
      if (investmentType === item.investmentType && item.patronCode === code) {
        return true;
      }
      return false;
    })?.id;
    return investmentId;
  };

  // Get the associated file list to that patron / entity
  getFilesByResource = (code = '', investmentType) => {
    const { investmentData } = this.state;
    const investmentId = investmentData?.find((item) => {
      if (investmentType === item.investmentType && item.companyCode === code) {
        return true;
      }
      if (investmentType === item.investmentType && item.patronCode === code) {
        return true;
      }
      return false;
    })?.id;
    return investmentId ? this.getFilesByResourceId(investmentId) : [];
  };

  getDocumentPropData = (type, path) => {
    const { signedDocData = {} } = this.state;
    if (signedDocData[type]) {
      return get(signedDocData[type], `[0].${path}`);
    }
    return '';
  };

  isDocAvailable = (data = []) => data.some((item) => item.files?.length > 0);

  handlePostMetaData = (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    postDocMetaData({
      resourceId,
      resourceType,
      name,
      type,
      size,
      docType,
      docCategory,
      key
    }).then((res) => {
      if (res?.data) {
        const { getDealDocs } = this.props;
        getDealDocs();
      }
    });
  };

  openAccordionListHandler = async (tabName, data, id) => {
    switch (tabName) {
      case TabsList.Patron:
        const mData = [...data];
        const updateData = mData.find((list) => list.id === id);
        const updateDataIndex = mData.findIndex((list) => list.id === id);
        const addressData = await getAddressesV2(id);
        if (addressData?.data?.length) {
          const patronAddress = addressData.data.find((list) => list.addressType === 'Permanent' || list.addressType === 'Permanent & Correspondence');
          if (patronAddress) {
            const addressString = patronAddress ? `${(patronAddress.line1 || '')} ${(patronAddress.line2 || '')}` : '';
            updateData.formData.patron_permanent_address.value = addressString;
            mData[updateDataIndex] = updateData;
          }
        }
        return mData;
      default:
        return [];
    }
  };

  accordionListHandler = (tabName) => {
    const { investorsListData, investmentData, brandData, brandOwnerData, PGData, POSData, bankData } = this.state;
    const { deal: dealData } = this.props;
    const DirectorList = brandOwnerData.filter((list) => list?.isDirector === true);
    switch (tabName) {
      case TabsList.Patron:
        return investorsListData?.length ? investorsListData.map((list) => {
          const investmentDetail = investmentData.find(
            (data) => (list.patronCode === data.patronCode) || (list.companyCode === data.companyCode)
          );
          return {
            id: list.companyCode || list.patronCode,
            title: list.businessName || list.name,
            tabName: TabsList.Patron,
            isCallBack: true,
            openAccordionListHandler: this.openAccordionListHandler,
            formData: {
              patron_name: list.name,
              patron_pan: list.pan,
              patron_email: list.email,
              patron_invested_amount: formatCurrency(investmentDetail?.amount || 0) || '',
              patron_fee: investmentDetail?.feePercentage || '',
              patron_no_of_deb_issued: investmentDetail?.amount
                ? investmentDetail.amount / 25000
                : 0
            }
          };
        }) : [];
      case TabsList.Director:
        return DirectorList?.length
          ? DirectorList.map((list, index) => ({
            id: list?.customer?.patronCode || `${index}-BrandDirectors`,
            title: list?.customer?.name || '',
            tabName: TabsList.Patron,
            isCallBack: true,
            openAccordionListHandler: this.openAccordionListHandler,
            formData: {
              director_name: list?.customer?.name || '',
              director_pan: list?.customer?.pan || '',
              director_email: list?.customer?.email || '',
              director_mobile: list?.customer?.mobile || '',
              is_authorized_signatory: list?.isAuthorizedSignatory || false
            }
          }))
          : [];
      case TabsList.Pg:
        return PGData?.length
          ? PGData.map((list, index) => ({
            id: list?.id || `${index}-PG`,
            title: list?.name || '',
            formData: {
              pg_account_type: list?.name || '',
              pg_account_name: list?.accountName || '',
              pg_account_number: list?.accountNumber || '',
              primary_pg: list?.isPrimary || '',
              pg_account_contribution: list?.minContribution || '',
              pg_account_split: list?.split || ''
            }
          }))
          : [];
      case TabsList.Pos:
        return POSData?.length
          ? POSData.map((list, index) => ({
            id: list?.id || `${index}-POS`,
            title: list?.name || '',
            formData: {
              pos_account_type: list?.name || '',
              pos_acc_name: list?.accountName || '',
              pos_acc_number: list?.accountNumber || '',
              primary_pos: list?.isPrimary || '',
              pos_account_contribution: list?.minContribution || '',
              pos_account_split: list?.split || ''
            }
          }))
          : [];
      case TabsList.Banking:
        return bankData?.length
          ? bankData.map((list, index) => ({
            id: list?.id || `${index}-Banking`,
            title: list?.bank?.name || '',
            formData: {
              BA_holder_name: list?.accountHolder || '',
              BA_number: list?.accountNumber || '',
              BA_name: list?.bank?.name || '',
              BA_branch_city: list?.address || '',
              BA_ifsc: list?.ifsc || '',
              BA_Type: list?.accountType || '',
              BA_primary_revenue_bank: list?.isPrimary || '',
              BA_investment_account: dealData?.capitalBankAccountId === list?.id
            }
          }))
          : [];
      default:
        return [];
    }
  };

  RevenueShareTabledata = async (take, page) => {
    const { deal: dealData } = this.props;
    const query = {
      where: { dealId: dealData.id },
      page,
      take
    };
    const res = await getRevenueProjections(query);
    if (res.data) {
      return {
        data: res.data,
        meta: res.meta.total
      };
    }
    return {
      data: [],
      meta: 0
    };
  };

  ShareHoldingTableData = async (take, page) => {
    const { brandData } = this.state;
    if (brandData?.data?.additionalData?.shareholdingData?.length) {
      const mData = brandData.data.additionalData.shareholdingData.slice((take * (page - 1)), (take * page));
      return {
        data: mData,
        meta: brandData.data.additionalData.shareholdingData.length
      };
    }
    return {
      data: [],
      meta: 0
    };
  }

  tableHandler = (tabName) => {
    switch (tabName) {
      case TabsList.RevenueShareTable:
        return {
          dataHandler: this.RevenueShareTabledata,
          defaultRows: 10,
          defaultPage: 0,
          tableColumns: [
            {
              Header: 'Revenue Share Month',
              accessor: 'revenueMonth',
              Cell: (row) => formatDateStandard(row.value),
              disableSortBy: true,
              disableFilters: true
            },
            {
              Header: 'Expected Revenue',
              accessor: 'expectedRevenue',
              Cell: (row) => formatCurrency(row.value),
              disableSortBy: true,
              disableFilters: true
            },
            {
              Header: 'Cumulative Revenue Shares Expected',
              accessor: 'expectedCumulativeRevenueShare',
              Cell: (row) => formatCurrency(row.value),
              disableSortBy: true,
              disableFilters: true
            }
          ]
        };
      case TabsList.SHARE_HOLIDING:
        return {
          dataHandler: this.ShareHoldingTableData,
          defaultRows: 10,
          defaultPage: 0,
          tableColumns: [
            {
              Header: 'Brand Shareholder Name',
              accessor: 'shareholderName',
              disableSortBy: true,
              disableFilters: true
            },
            {
              Header: 'Quantity of Shares',
              accessor: 'numberOfShares',
              disableSortBy: true,
              disableFilters: true
            },
            {
              Header: 'Brand Shareholding (%)',
              accessor: 'shareholdingPercentage',
              disableSortBy: true,
              disableFilters: true
            }
          ]
        };
      default:
        return {};
    }
  }

  handleCloseErrorDetailDialog = () => {
    this.setState({ errorDetailDialog: false });
  }

  handleOpenErrorDetailDialog = () => {
    this.setState({ errorDetailDialog: true });
  }

  isTabularUI = (type) => [DocType.MoneteryAndCollection, DocType.DebentureSubscription].includes(type);

  handleDelete = (fileId) => {
    removeFile(fileId).then((res) => {
      if (res.data) {
        const { getDealDocs } = this.props;
        getDealDocs(true);
        this.getAllDocuments(); // Get updated documents list
      }
    });
  }

  render() {
    const { deal, DEALConfig = [], dealDocValidation, DEALDocConfig, InvestmentConfig = [], InvestmentDocConfig } = this.props;
    const { percentageComplete, dataErrors } = dealDocValidation;
    const isCompleted = percentageComplete === 100;
    const { investorsListData, signedDocData, selectedDocType, metaData } = this.state;
    const { type } = selectedDocType || {};
    const { id } = deal || {};

    const docUploadConfig = DEALConfig && DEALConfig?.find((data) => data?.documentType?.key === `${type}_ESTAMP`);

    const InvestDocUpload = InvestmentConfig && InvestmentConfig?.find((data) => data?.documentType?.key === DocType.MoneteryAndCollection);

    return (
      <>
        <Grid container={true}>
          {dealDocValidation?.percentageComplete ? (
            <Grid
              item={true}
              container={true}
              className={`${styles.statusBarContainer} ${isCompleted ? styles.success : ''
              }`}
              xs={12}
              alignItems="center"
            >
              <Grid
                container={true}
                xs={isCompleted ? 12 : 9}
                alignItems="center"
              >
                <img
                  src={
                    isCompleted
                      ? '/assets/green_check.svg'
                      : '/assets/warning.svg'
                  }
                  alt="warning"
                  height="20"
                  width="20"
                />
                <Grid
                  item={true}
                  className={`${styles.statusBarPercentage} ${isCompleted ? styles.successPercentage : ''
                  }`}
                >
                  {`${Math.round(percentageComplete || 0)}%`}
                </Grid>
                <Grid item={true} className={styles.statusBarText}>
                  {isCompleted
                    ? `You are good to generate agreements. All data points are updated.`
                    : `Data points are missing in ${dataErrors?.length || 0
                    } modules for this investment round`}
                </Grid>
              </Grid>
              {!isCompleted && (
                <Grid
                  item={true}
                  xs={3}
                  className={styles.statusBarButtonContainer}
                >
                  <Grid onClick={this.handleOpenErrorDetailDialog}>
                    View missing data
                  </Grid>
                </Grid>
              )}
            </Grid>
          ) : null}
          {docList.length ? (
            docList.map(
              (application) => (
                <Grid item={true} key={application.id} xs={12}>
                  <ControlledAccordion
                    unmountOnExit={true}
                    customBasis="95%"
                    heading={
                      <>
                        <p className={styles.mainHeading}>
                          {application.name}
                          <span className={this.getDocStyles()} style={{ marginLeft: 10 }}>
                            {this.getDocCompletedRatio()}
                          </span>
                        </p>
                        {this.getDocumentPropData(application.type, 'updatedAt') && (
                          <small className={styles.subHeading}>
                            Last updated:
                            <time dateTime={application.lastUpdatedAt}>
                              {new Date(
                                this.getDocumentPropData(application.type, 'updatedAt')
                              ).toLocaleString()}
                            </time>
                          </small>
                        )}
                        {this.state.expanded !== application.id && (
                          <small
                            className={`${styles.statusBtn} ${this.getStatusStyle(application)}`}
                          >
                            {this.getDocumentStatus(application)}
                          </small>
                        )}
                      </>
                    }
                    expanded={this.state.expanded}
                    id={application.id}
                    handleChange={() => this.handleExpanded(application)}
                  >
                    <Grid container={true} className={styles.fieldContainer}>
                      <form
                        // onSubmit={handleSubmit(onSubmit)}
                        style={{ width: '100%' }}
                      >
                        <Grid item={true} xs={12} className={styles.fieldItem}>
                          <Grid container={true} justify="space-between" alignContent="center">
                            <Grid item={true} xs={12}>
                              <CustomizedSteppers steps={this.getSteps({ application })} activeStep={this.getActiveStep(application)} />
                            </Grid>

                            {/* {application.type === DocType.MoneteryAndCollection && ( */}
                            {/* {this.isTabularUI(application.type) && ( */}
                            <Grid item={true} xs={12} className={styles.tableWrapper}>
                              {application.type === DocType.MoneteryAndCollection
                                ? <MoneteryTable
                                    investorsListData={investorsListData}
                                    getFilesByResource={this.getFilesByResource}
                                    signedDocData={signedDocData}
                                    deal={deal}
                                    getInvestorsList={this.getInvestorsList}
                                    metaData={metaData}
                                    getAllDocuments={this.getAllDocuments}
                                    docUploadConfig={InvestDocUpload}
                                    getInvestmentId={this.getInvestmentId}
                                />
                                : <ESignTableLinks
                                    investorsListData={investorsListData}
                                    getFilesByResource={this.getFilesByResource}
                                    signedDocData={signedDocData}
                                    docType={application.type}
                                    getInvestorsList={this.getInvestorsList}
                                    metaData={metaData}
                                />}
                            </Grid>
                            {/* )} */}

                            <Grid container={true} xs={12}>
                              {application.type !== DocType.MoneteryAndCollection && (
                              <>
                                {this.isDocAvailable(this.getFilesByDocType(application)?.generatedFiles) && (
                                  <>
                                    <Grid item={true} xs={6}>
                                      <Grid container={true} xs={12}>
                                        <p>
                                          <span className={styles.generatedDoc}>Document(s) with Estamp</span>
                                        </p>
                                      </Grid>

                                      <Grid container={true} xs={12}>
                                        {this.getFilesByDocType(application)?.uploadedFiles?.map((doc) => doc.files?.map((file) => (
                                          <Grid item={true} xs={12} style={{ marginBottom: '15px' }}>
                                            <DocumentFile name={file.fileName} id={file.id} onDeleteClick={() => this.handleDelete(file.id)} />
                                          </Grid>
                                        ))
                                      )}
                                      </Grid>
                                      <Grid item={true} xs={12}>
                                        <p className={styles.addInfo}>
                                          <FileUploader
                                            btnLabel="Upload documents with Estamp"
                                            uploadedDocumentCount={null}
                                            resourceType="DEAL"
                                            docCategory={DEALDocConfig?.documentCategory?.key}
                                            resourceId={id}
                                            minNumberOfFiles={1}
                                            getPreSignedUrl={getPatronDocPresignedUrl}
                                            handleSaveMetaData={this.handlePostMetaData}
                                            docType={docUploadConfig?.documentType || {}}
                                          />
                                        </p>
                                      </Grid>
                                    </Grid>
                                  </>
                                )}

                                {this.isDocAvailable(this.getFilesByDocType(application)?.generatedFiles) && (
                                  <Grid item={true} xs={4}>
                                    <Grid container={true} xs={12}>
                                      <p>
                                        <span className={styles.generatedDoc}>Generated Document(s)</span>
                                      </p>
                                    </Grid>

                                    <Grid container={true} xs={12}>
                                      {this.getFilesByDocType(application)?.generatedFiles?.map((doc) => doc.files?.map((file) => (
                                        <Grid item={true} xs={12} style={{ marginBottom: '15px' }}>
                                          <DocumentFile name={file.fileName} id={file.id} />
                                        </Grid>
                                      ))
                                      )}
                                    </Grid>
                                  </Grid>
                                )}
                              </>
                              )}
                            </Grid>

                            {/* <Grid item={true} xs={12}>
                            <Grid
                              className={styles.addInfo}
                              onClick={() => this.handleOpenFormDialog(application)}
                            >
                              Information pending
                            </Grid>
                          </Grid> */}

                            {/* <hr className={styles.seperator} />

                          <Grid item={true} xs={12}>
                            <p className={styles.previewLink}>Preview older versions</p>
                          </Grid> */}
                          </Grid>
                        </Grid>
                      </form>
                    </Grid>
                  </ControlledAccordion>
                </Grid>
              )
            )
          ) : (
            <p>No Directors/Founders Found</p>
          )}
          {this.state.dialogForm && (
            <DialogComponent
              title={this.state.dialoagTitle}
              onClose={this.handleCloseFormDialog}
              closeButton={false}
              customWidth="70%"
              customPadding="12px 0px 12px"
              customBodyPadding="8px 0px"
              titleStyles={{ paddingLeft: '35px' }}
            >
              <DetailForm
                onClose={this.handleCloseFormDialog}
                type={this.state.dialoagType}
                formData={this.state.formData}
                accordionList={this.accordionListHandler}
                tableHandler={this.tableHandler}
                onSubmit={this.submitHandler}
              />
            </DialogComponent>
          )}

          {this.state.errorDetailDialog && (
            <DialogComponent
              title="Missing data points"
              onClose={this.handleCloseErrorDetailDialog}
              closeButton={false}
              customWidth="55%"
              customPadding="12px 18px"
              customBodyPadding="12px 32px"
            >
              <ErrorDetail
                onClose={this.handleCloseErrorDetailDialog}
                error={dataErrors}
              />
            </DialogComponent>
          )}

        </Grid>
      </>
    );
  }
}

export default DocListing;
