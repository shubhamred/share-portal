import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { formatDateStandard, handleTagSelection } from 'app/utils/utils';
import {
  getDealDocPresignedUrl,
  getDocs,
  getDocsbyId,
  getDocTypeConfig,
  postMetaData,
  removeFile,
  viewImage,
  getDocConfig,
  removeDealImage,
  getDealDetail
} from 'app/containers/deals/saga';
import DealHeaderForm from './dealHeaderForm';
import validate from './validate';

const DealHeaderFormWrapper = reduxForm({
  form: 'dealHeaderForm',
  enableReinitialize: true,
  validate
})(DealHeaderForm);

const mapStateToProps = (state) => {
  const { dealReducer } = state;
  return {
    initialValues: {
      dealName: dealReducer.deal.data.name,
      dealAmount: dealReducer.deal.data.dealAmount,
      dealReturn: dealReducer.deal.data.dealReturn,
      returnType: dealReducer.deal.data.returnType,
      dealAmountUnit: dealReducer.deal.data.dealAmountUnit,
      dealCurrency: dealReducer.deal.data.dealCurrency,
      brandLogo: dealReducer.deal.data.brandLogo,
      dealCover: dealReducer.deal.data.dealCover,
      dealBanner: dealReducer.deal.data.dealBanner,
      mobileBanner: dealReducer.deal.data.mobileBanner,
      score: dealReducer.deal.data.score,
      description: dealReducer.deal.data.description,
      minReturn: dealReducer.deal.data.minReturn,
      maxReturn: dealReducer.deal.data.maxReturn,
      irr: dealReducer.deal.data.irr,
      yield: dealReducer.deal.data.yield,
      repaymentFrequency: dealReducer.deal.data.repaymentFrequency,
      investmentType: dealReducer.deal.data.investmentType,
      shareText: dealReducer.deal.data.shareText,
      performanceNote: dealReducer.deal.data.performanceNote,
      disclosureSchedule: dealReducer.deal.data?.agreementData?.disclosureSchedule || '',
      performanceStatus: dealReducer.deal.data.performanceStatus,
      minimumInvestment: dealReducer.deal.data.minimumInvestment,
      revenueShare: dealReducer.deal.data.revenueShare,
      investmentPeriod: dealReducer.deal.data.investmentPeriod,
      dealTag: handleTagSelection(dealReducer.deal.data.dealTag),
      customDealTag: dealReducer.deal.data.dealTag,
      investmentFee: dealReducer.deal.data.investmentFee,
      moratoriumPeriod: dealReducer.deal.data.moratoriumPeriod,
      dealType: dealReducer.deal.data.isPrivate ? 'Private' : 'Public',
      publishedAt:
      dealReducer.deal.data.publishedAt
      && formatDateStandard(dealReducer.deal.data.publishedAt),
      unPublishedAt:
      dealReducer.deal.data.unPublishedAt
      && formatDateStandard(dealReducer.deal.data.unPublishedAt),
      disbursementDate:
      dealReducer.deal.data.disbursementDate
      && formatDateStandard(dealReducer.deal.data.disbursementDate),
      maturityDate:
      dealReducer.deal.data.maturityDate
      && formatDateStandard(dealReducer.deal.data.maturityDate),
      docSigningDate:
      dealReducer.deal.data.docSigningDate
      && formatDateStandard(dealReducer.deal.data.docSigningDate),
      baseRevenueAmount: dealReducer.deal.data.baseRevenueAmount,
      lowerCapRevenuePercentage: dealReducer.deal.data.lowerCapRevenuePercentage,
      upperCapRevenuePercentage: dealReducer.deal.data.upperCapRevenuePercentage,
      riskAcceptanceText: dealReducer.deal.data.riskAcceptanceText,
      boardResolutionDate:
        dealReducer.deal.data?.agreementData?.boardResolutionDate
        && formatDateStandard(dealReducer.deal.data.agreementData.boardResolutionDate),
      egmDate:
        dealReducer.deal.data?.agreementData?.egmDate
        && formatDateStandard(dealReducer.deal.data.agreementData.egmDate),
      trusteeAgreementDate:
        dealReducer.deal.data?.agreementData?.trusteeAgreementDate
        && formatDateStandard(dealReducer.deal.data.agreementData.trusteeAgreementDate),
      engagementLetterDate:
        dealReducer.deal.data?.agreementData?.engagementLetterDate
        && formatDateStandard(dealReducer.deal.data.agreementData.engagementLetterDate),
      trusteeConsentLetterDate:
        dealReducer.deal.data?.agreementData?.trusteeConsentLetterDate
        && formatDateStandard(dealReducer.deal.data.agreementData.trusteeConsentLetterDate),
      trusteeConsentReferenceNumber: dealReducer.deal.data?.agreementData?.trusteeConsentReferenceNumber,
      debentureSeries: dealReducer.deal.data.debentureSeries,
      hypothicationDetail: dealReducer.deal.data.hypothicationDetail,
      agreementData: dealReducer.deal.data.agreementData,
      visibility: dealReducer.deal.data.visibility
    },
    dealHeaderFormUpdated: dealReducer.dealHeaderFormUpdated,
    docConfig: dealReducer.dealDocConfig && dealReducer.dealDocConfig,
    dealId: dealReducer.deal.data.id,
    formValues: getFormValues('dealHeaderForm')(state)
  };
};

const mapDispatchToProps = (dispatch) => ({
  viewImage,
  removeFile,
  removeDealImage,
  getDealDetail,
  getDealDocPresignedUrl,
  getDocTypeConfig,
  getDocs,
  getDocsbyId,
  postMetaData,
  getDocConfig,
  saveMetaData: (
    resourceId,
    resourceType,
    name,
    type,
    size,
    docType,
    docCategory,
    key
  ) => {
    dispatch({
      type: 'DEAL_DOCUMENT:META_DATA:SAVE',
      metaData: {
        resourceId,
        resourceType,
        name,
        type,
        size,
        docType,
        docCategory,
        key
      }
    });
  },
  cancelMetaData: () => {
    dispatch({ type: 'DEAL_DOCUMENT:META_DATA:CANCEL' });
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DealHeaderFormWrapper);
