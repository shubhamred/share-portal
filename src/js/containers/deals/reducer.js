/* eslint-disable no-case-declarations */
import Immutable from 'seamless-immutable';
import { sortBy, startCase } from 'lodash';
import { formatDate } from 'app/utils/utils';
import {
  addVersionInConfig,
  appendFieldToSection,
  appendFieldToSectionOld,
  changeFieldVisibility,
  changeFieldVisibilityOld,
  changeSectionVisibility,
  getGroups,
  mapFormValuesToDeal,
  mapFormValuesToDealOld,
  removefieldFromSection,
  removefieldFromSectionOld,
  removeValueFromSubField,
  reOrderFields,
  updateFieldInfoText,
  updateFieldLabel,
  updateSingleDealSection, updateSingleFieldData
} from 'app/containers/deals/mappers';
import { DEAL_SINGLE_FIELD_UPDATE,
  DEAL_DOCUMENT_VALIDATION_UPDATE,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_FAIL,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_INIT,
  DEAL_CREATE_DOCUMENT_LIST_FETCH_SUCCESS,
  DEAL_CREATE_DOCUMENT_METADATA_POST_SUCCESS,
  DEAL_DATA_CONFIG_FETCH_FAIL,
  DEAL_DATA_CONFIG_FETCH_INIT,
  DEAL_DATA_CONFIG_FETCH_SUCCESS,
  DEAL_DATA_GENERIC_CONFIG_FETCH_FAIL,
  DEAL_DATA_GENERIC_CONFIG_FETCH_SUCCESS,
  DEAL_DETAIL_FETCH_FAIL,
  DEAL_DETAIL_FETCH_SUCCESS,
  DEAL_DETAIL_UPDATE_FAIL,
  DEAL_DETAIL_UPDATE_SUCCESS,
  DEAL_DOC_CONFIG_FAIL,
  DEAL_DOC_CONFIG_SUCCESS,
  DEAL_DOCUMENT_FETCH_FAIL,
  DEAL_DOCUMENT_FETCH_INIT,
  DEAL_DOCUMENT_FETCH_SUCCESS,
  DEAL_DOCUMENT_TYPE_FETCH_FAIL,
  DEAL_DOCUMENT_TYPE_FETCH_SUCCESS,
  DEAL_GROUP_FETCH_FAIL,
  DEAL_GROUP_FETCH_SUCCESS,
  DEAL_INVESTMENT_CREATE_FAIL,
  DEAL_INVESTMENT_CREATE_INIT,
  DEAL_INVESTMENT_CREATE_SUCCESS,
  DEAL_INVESTMENT_DETAIL_FETCH_FAIL,
  DEAL_INVESTMENT_DETAIL_FETCH_INIT,
  DEAL_INVESTMENT_DETAIL_FETCH_SUCCESS,
  DEAL_INVESTMENT_FETCH_FAIL,
  DEAL_INVESTMENT_FETCH_INIT,
  DEAL_INVESTMENT_FETCH_SUCCESS,
  DEAL_INVESTMENT_STATUS_UPDATE_FAIL,
  DEAL_INVESTMENT_STATUS_UPDATE_INIT,
  DEAL_INVESTMENT_STATUS_UPDATE_SUCCESS,
  DEAL_INVESTMENT_UPDATE_FAIL,
  DEAL_INVESTMENT_UPDATE_INIT,
  DEAL_INVESTMENT_UPDATE_SUCCESS,
  DEAL_LIST_FETCH_FAIL,
  DEAL_LIST_FETCH_SUCCESS,
  DEAL_SECTIONS_FETCH_FAIL,
  DEAL_SECTIONS_FETCH_SUCCESS,
  DEAL_SINGLE_SECTION_UPDATE_SUCCESS,
  DEAL_STATUS_UPDATE_SUCCESS } from 'app/actions';

const defaultState = Immutable.flatMap({
  createInvestmentStatus: null,
  updateInvestmentStatus: null,
  investmentStatusUpdateStatus: null,
  investmentDetail: null,
  investmentList: null,
  deal: {
    data: {
      id: '',
      name: '',
      brandId: '',
      brandApplicationId: '',
      configurationId: '',
      dealAmount: '',
      dealAIrr: '',
      dealAmountUnit: '',
      dealCurrency: '',
      brandLogo: '',
      dealCover: '',
      dealBanner: '',
      description: '',
      publishedAt: '',
      unPublishedAt: '',
      sections: []
    }
  },
  dealConfig: {
    data: {
      config: {}
    }
  },
  dealDocConfig: {},
  sectionConfig: [],
  sectionList: [],
  genericConfig: null,
  dealList: null,
  totalCount: 0,
  nextTab: undefined,
  formSubmitted: false,
  dealSaveStatus: null,
  formErrors: null,
  dealHeaderFormUpdated: false,
  currentSectionData: null,
  currentSectionDataUpdated: false,
  dealSections: null,
  isUsingOldConfig: null,
  dealFieldsAreReordered: false,
  isDealSectionChanged: false,
  sectionGroups: [],
  selectedGroups: [],
  showDealError: false,
  investmentStatuses: [],
  dealDocValidation: {}
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case DEAL_DATA_CONFIG_FETCH_INIT:
      return Immutable.merge(state, {
        config: null,
        sectionConfig: null
      });
    case DEAL_DATA_CONFIG_FETCH_SUCCESS:
      if (
        !Array.isArray(action.data.data.config)
        && typeof action.data.data.config === 'object'
      ) {
        const modifiedConfig = Object.entries(
          action.data.data.config
        ).map((data) => ({ ...data[1], key: data[0] }));
        const configWithVersion = addVersionInConfig(
          state.deal.data,
          modifiedConfig
        );
        const sortedData = sortBy(configWithVersion, 'order');
        const ordered = {};
        sortedData.forEach((key) => {
          const k = Object.keys(action.data.data.config).filter(
            (v) => action.data.data.config[v].order === key.order
          );
          ordered[k[0]] = key;
        });
        return Immutable.merge(state, {
          dealConfig: {
            ...action.data.data,
            config: ordered
          },
          isUsingOldConfig: true,
          sectionConfig: sortBy(configWithVersion, 'order'),
          sectionList: sortBy(configWithVersion, 'order').map((value) => ({
            label: value.label,
            key: value.key
          }))
        });
      }
      return Immutable.merge(state, {
        dealConfig: {
          ...action.data.data,
          config: action.data.data.config
        },
        sectionConfig: action.data.data.config,
        isUsingOldConfig: false
      });

    case DEAL_DATA_CONFIG_FETCH_FAIL:
      return Immutable.merge(state, {
        config: null,
        sectionConfig: null,
        sectionList: null,
        isUsingOldConfig: null
      });
    case DEAL_DATA_GENERIC_CONFIG_FETCH_SUCCESS:
      // const lastConfig = action.data.data[action.data.data.length - 1];
      // const modifiedConfig = Object.entries(lastConfig.config).map((data) => ({ ...data[1], key: data[0] }));
      return Immutable.merge(state, {
        genericConfig: action.data.data
        // sectionList: sortBy(modifiedConfig, 'order').map((value) => ({
        //   label: value.label,
        //   key: value.key
        // }))
      });

    case DEAL_DATA_GENERIC_CONFIG_FETCH_FAIL:
      return Immutable.merge(state, { genericConfig: null });

    case 'SECTION:SUBMIT': {
      let singleSectionData;
      if (state.isUsingOldConfig) {
        singleSectionData = mapFormValuesToDealOld(
          state.currentSectionData,
          state.dealConfig.config,
          action.sectionName,
          action.formValues
        );
      } else {
        singleSectionData = mapFormValuesToDeal(
          state.currentSectionData,
          state.dealConfig.config,
          action.sectionName,
          action.formValues
        );
      }
      // console.log(singleSectionData);
      return state.merge(
        {
          currentSectionData: singleSectionData,
          currentSectionDataUpdated: true,
          dealFieldsAreReordered: false
        },
        { deep: true }
      );
    }

    case 'SECTION:DETAIL:UPDATED':
      return Immutable.merge(state, {
        currentSectionDataUpdated: false,
        dealFieldsAreReordered: false
      });

    case 'SECTION:FIELD:ADD': {
      let singleSectionWithNewField;
      if (state.isUsingOldConfig) {
        singleSectionWithNewField = appendFieldToSectionOld(
          state.currentSectionData,
          action.sectionName,
          action.fieldName,
          action.fieldLabel
        );
      } else {
        singleSectionWithNewField = appendFieldToSection(
          state.currentSectionData,
          action.sectionName,
          action.fieldType,
          action.fieldLabel
        );
      }
      return state.merge(
        {
          currentSectionData: singleSectionWithNewField
        },
        { deep: true }
      );
    }

    case 'DEAL:PROPERTY:SUBMIT': {
      const dealData = {
        name: action.values.dealName,
        dealAmount: Number(action.values.dealAmount),
        dealCurrency: action.values.dealCurrency,
        dealAmountUnit: action.values.dealAmountUnit,
        dealReturn: action.values.dealReturn,
        returnType: action.values.returnType,
        brandLogo:
          action.values.brandLogo === '' ? null : action.values.brandLogo,
        dealCover:
          action.values.dealCover === '' ? null : action.values.dealCover,
        dealBanner:
          action.values.dealBanner === '' ? null : action.values.dealBanner,
        description: action.values.description,
        publishedAt: action.values.publishedAt
          ? formatDate(action.values.publishedAt)
          : null,
        unPublishedAt: action.values.unPublishedAt
          ? formatDate(action.values.unPublishedAt)
          : null,
        maturityDate: action.values.maturityDate
          ? formatDate(action.values.maturityDate)
          : null,
        docSigningDate: action.values.docSigningDate
          ? formatDate(action.values.docSigningDate)
          : null,
        disbursementDate: action.values.disbursementDate
          ? formatDate(action.values.disbursementDate)
          : null,
        minReturn: action.values.minReturn,
        maxReturn: action.values.maxReturn,
        irr: action.values.irr,
        yield: Number(action.values.yield),
        repaymentFrequency: action.values.repaymentFrequency,
        investmentType: action.values.investmentType,
        shareText: action.values.shareText,
        performanceNote: action.values.performanceNote,
        performanceStatus: action.values.performanceStatus,
        minimumInvestment: Number(action.values.minimumInvestment),
        revenueShare: Number(action.values.revenueShare),
        investmentPeriod: Number(action.values.investmentPeriod),
        score: Number(action.values.score),
        mobileBanner: action.values.mobileBanner,
        dealTag: action.values.dealTag,
        investmentFee: Number(action.values.investmentFee),
        // eslint-disable-next-line radix
        moratoriumPeriod: parseInt(action.values.moratoriumPeriod),
        isPrivate: action.values.dealType !== 'Public',
        debentureSeries: action.values.debentureSeries,
        hypothicationDetail: action.values.hypothicationDetail,
        baseRevenueAmount: action.values.baseRevenueAmount,
        lowerCapRevenuePercentage: action.values.lowerCapRevenuePercentage,
        upperCapRevenuePercentage: action.values.upperCapRevenuePercentage,
        visibility: action.values.visibility,
        riskAcceptanceText: action.values.riskAcceptanceText,
        agreementData: {
          boardResolutionDate: action.values.boardResolutionDate
            ? formatDate(action.values.boardResolutionDate)
            : null,
          egmDate: action.values.egmDate
            ? formatDate(action.values.egmDate)
            : null,
          trusteeAgreementDate: action.values.trusteeAgreementDate
            ? formatDate(action.values.trusteeAgreementDate)
            : null,
          engagementLetterDate: action.values.engagementLetterDate
            ? formatDate(action.values.engagementLetterDate)
            : null,
          trusteeConsentLetterDate: action.values.trusteeConsentLetterDate
            ? formatDate(action.values.trusteeConsentLetterDate)
            : null,
          disclosureSchedule: action?.values?.disclosureSchedule || null,
          trusteeConsentReferenceNumber: action.values.trusteeConsentReferenceNumber || undefined
        }
      };
      return state.merge(
        {
          deal: {
            data: dealData
          },
          dealHeaderFormUpdated: true
        },
        { deep: true }
      );
    }
    case 'SET:DEAL_HEADER_FORM_UPDATED':
      return Immutable.merge(state, { dealHeaderFormUpdated: false });
    case 'SET:UNPUBLISHDATE_NULL':
      return Immutable.merge(state, {
        deal: { data: { ...state.deal.data, unPublishedAt: null } }
      });

    case 'SECTION:FIELD:DELETE': {
      let singleSectionsWithNewField;
      if (state.isUsingOldConfig) {
        singleSectionsWithNewField = removefieldFromSectionOld(
          state.currentSectionData,
          action.sectionName,
          action.fieldKey
        );
      } else {
        singleSectionsWithNewField = removefieldFromSection(
          state.currentSectionData,
          action.sectionName,
          action.fieldKey
        );
      }
      return state.merge(
        {
          currentSectionData: singleSectionsWithNewField
        },
        { deep: true }
      );
    }

    case 'SECTION:SUB_FIELD_VALUE:DELETE': {
      const singleSectionWithNewField = removeValueFromSubField(
        state.currentSectionData,
        action.sectionName,
        action.fieldKey,
        action.newValues
      );
      return state.merge(
        {
          currentSectionData: singleSectionWithNewField
        },
        { deep: true }
      );
    }

    case 'DEAL_FIELD_VISIBILITY:CHANGE': {
      let singleUpdatedSection;
      if (state.isUsingOldConfig) {
        singleUpdatedSection = changeFieldVisibilityOld(
          state.currentSectionData,
          action.sectionName,
          action.fieldKey,
          action.visibilityValue
        );
      } else {
        singleUpdatedSection = changeFieldVisibility(
          state.currentSectionData,
          action.sectionName,
          action.fieldKey,
          action.visibilityValue
        );
      }
      return state.merge(
        {
          currentSectionData: singleUpdatedSection
        },
        { deep: true }
      );
    }

    case 'DEAL_SECTION_VISIBILITY:CHANGE': {
      const singleSectionWithSectionVisibilityChange = changeSectionVisibility(
        state.currentSectionData,
        action.sectionName,
        action.visibilityValue
      );
      return state.merge(
        {
          currentSectionData: singleSectionWithSectionVisibilityChange,
          currentSectionDataUpdated: true
        },
        { deep: true }
      );
    }

    case DEAL_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, {
        dealList: action.data.data,
        totalCount: action.data.meta.total
      });

    case DEAL_LIST_FETCH_FAIL:
      return Immutable.merge(state, { dealList: null, totalCount: 0 });

    case DEAL_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, {
        deal: {
          data: action.data.data
        },
        dealSections: action.data.data.sections || [],
        dealDocumentList: [],
        sectionList: sortBy(action.data.data.sections || [], 'order').map(
          (value) => ({
            label: startCase(value.key),
            key: value.key
          })
        )
      });
    case DEAL_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { deal: {} });
    case DEAL_CREATE_DOCUMENT_LIST_FETCH_INIT:
      return Immutable.merge(state, { dealDocumentList: [] });

    case DEAL_CREATE_DOCUMENT_LIST_FETCH_SUCCESS:
      return Immutable.merge(state, { dealDocumentList: action.data.data });

    case DEAL_CREATE_DOCUMENT_LIST_FETCH_FAIL:
      return Immutable.merge(state, { dealDocumentList: [] });

    case DEAL_STATUS_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        deal: {
          data: action.data.data
        }
      });

    case DEAL_DOCUMENT_FETCH_INIT:
      return Immutable.merge(state, { dealDocumentList: [] });

    case DEAL_DOCUMENT_FETCH_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const docArray = [];
      docArray.push(action.data.data);
      return Immutable.merge(state, { dealDocumentList: docArray });

    case DEAL_DOCUMENT_FETCH_FAIL:
      return Immutable.merge(state, { dealDocumentList: [] });

    case DEAL_DOCUMENT_TYPE_FETCH_SUCCESS:
      return Immutable.merge(state, { docTypeConfig: action.data.data });

    case DEAL_DOCUMENT_TYPE_FETCH_FAIL:
      return Immutable.merge(state, { docTypeConfig: null });

    case DEAL_DETAIL_UPDATE_SUCCESS:
      return Immutable.merge(state, { dealSaveStatus: 'success' });

    case DEAL_DETAIL_UPDATE_FAIL:
      return Immutable.merge(state, { dealSaveStatus: 'failed' });
    case DEAL_CREATE_DOCUMENT_METADATA_POST_SUCCESS:
      return Immutable.merge(state, {
        metaData: null,
        postedMetaData: action.data.data
      });

    case '@@redux-form/SET_SUBMIT_SUCCEEDED': {
      if (action.meta.form === 'DealForm') {
        return state.merge({
          formSubmitted: true,
          formErrors: null,
          dealFieldsAreReordered: false,
          isDealSectionChanged: false,
          showDealError: false
        });
      }
      return state;
    }

    case '@@redux-form/CHANGE': {
      if (action.meta.form === 'DealForm') {
        return state.merge({
          isDealSectionChanged: true
        });
      }
      return state;
    }

    case '@@redux-form/SET_SUBMIT_FAILED': {
      if (action.meta.form === 'DealForm') {
        return state.merge({
          dealFieldsAreReordered: false,
          showDealError: true
        });
      }
      return state;
    }

    case 'RESET_DEAL_SECTION_CHANGE':
      return state.merge({ isDealSectionChanged: false });

    case 'RESET_FORMSUBMITTED':
      return state.merge({ formSubmitted: false });
    case 'NEXTAB_SET':
      return state.merge({ nextTab: action.tab });
    case 'NEXTAB_RESET':
      return state.merge({ nextTab: undefined });
    case 'DEAL_DOCUMENT:META_DATA:SAVE':
      return Immutable.merge(state, { metaData: action.metaData });
    case 'DEAL_DOCUMENT:META_DATA:CANCEL':
      return Immutable.merge(state, { metaData: null });

    case DEAL_INVESTMENT_FETCH_INIT:
      return Immutable.merge(state, { investmentList: null });

    case DEAL_INVESTMENT_FETCH_SUCCESS:
      return Immutable.merge(state, {
        investmentList: action.data.data,
        totalCount: action.data.meta.total
      });

    case DEAL_INVESTMENT_FETCH_FAIL:
      return Immutable.merge(state, { investmentList: null, totalCount: 0 });

    case DEAL_INVESTMENT_CREATE_INIT:
      return Immutable.merge(state, { createInvestmentStatus: 'init' });

    case DEAL_INVESTMENT_CREATE_SUCCESS:
      return Immutable.merge(state, {
        createInvestmentStatus: 'success',
        investmentDetail: action.data.data
      });

    case DEAL_INVESTMENT_CREATE_FAIL:
      return Immutable.merge(state, { createInvestmentStatus: 'failed' });

    case DEAL_INVESTMENT_DETAIL_FETCH_INIT:
      return Immutable.merge(state, { investmentDetail: null });

    case DEAL_INVESTMENT_DETAIL_FETCH_SUCCESS:
      return Immutable.merge(state, { investmentDetail: action.data.data });

    case DEAL_INVESTMENT_DETAIL_FETCH_FAIL:
      return Immutable.merge(state, { investmentDetail: null });

    case DEAL_INVESTMENT_UPDATE_INIT:
      return Immutable.merge(state, { updateInvestmentStatus: 'init' });

    case DEAL_INVESTMENT_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        updateInvestmentStatus: 'success',
        investmentDetail: action.data.data
      });

    case DEAL_INVESTMENT_UPDATE_FAIL:
      return Immutable.merge(state, { updateInvestmentStatus: 'failed' });

    case DEAL_INVESTMENT_STATUS_UPDATE_INIT:
      return Immutable.merge(state, { investmentStatusUpdateStatus: 'init' });

    case DEAL_INVESTMENT_STATUS_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        investmentStatusUpdateStatus: 'success'
      });

    case DEAL_INVESTMENT_STATUS_UPDATE_FAIL:
      return Immutable.merge(state, { investmentStatusUpdateStatus: 'failed' });
    case DEAL_DOC_CONFIG_SUCCESS:
      return Immutable.merge(state, { dealDocConfig: action.data.data });
    case DEAL_DOC_CONFIG_FAIL:
      return Immutable.merge(state, { dealDocConfig: null });
    case 'DEAL:DEAL_IMAGES_UPDATE:ADD':
      // eslint-disable-next-line no-case-declarations
      const temp = {
        data: { ...state.deal.data, [action.key]: action.value }
      };
      return Immutable.merge(state, { deal: temp });
    case 'DEAL:DEAL_IMAGES_UPDATE:DELETE':
      // eslint-disable-next-line no-case-declarations
      const tempData = {
        data: { ...state.deal.data, [action.key]: null }
      };
      return Immutable.merge(state, { deal: tempData });
    case 'SET:DEAL_FORM_ERRORS':
      return action.error
        ? Immutable.merge(state, { formErrors: action.meta })
        : state;
    case 'REMOVE:DEAL_FORM_ERROR':
      return Immutable.merge(state, { formErrors: null });

    case DEAL_GROUP_FETCH_SUCCESS:
      return Immutable.merge(state, { sectionGroups: action.data.data });
    case DEAL_GROUP_FETCH_FAIL:
      return Immutable.merge(state, { sectionGroups: [] });

    case DEAL_SINGLE_SECTION_UPDATE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      const sectionsWithUpdatedField = updateSingleDealSection(
        state.dealSections,
        action.data.data
      );
      const { data, groups } = getGroups(action.data.data);
      return state.merge(
        {
          dealSections: sectionsWithUpdatedField,
          currentSectionData: [data],
          showDealError: false,
          dealFieldsAreReordered: false,
          selectedGroups: groups,
          isDealSectionChanged: false
        },
        { deep: true }
      );
    case 'DEAL_SECTION:SET_NULL':
      return Immutable.merge(state, { currentSectionData: null });
    case DEAL_SECTIONS_FETCH_SUCCESS:
      return Immutable.merge(state, {
        dealSections: action.data.data.sections,
        deal: action.data
      });
    case DEAL_SECTIONS_FETCH_FAIL:
      return Immutable.merge(state, { dealSections: null });
    case 'DEAL_SECTION_FIELD_LABEL:UPDATE':
      const newData = updateFieldLabel(
        state.currentSectionData[0],
        action.fieldKey,
        action.newLabel
      );
      return Immutable.merge(state, { currentSectionData: [newData] });
    case 'DEAL_SECTION_FIELD_INFO:UPDATE':
      const sectionDataWithUpdatedFieldInfo = updateFieldInfoText(
        state.currentSectionData[0],
        action.fieldKey,
        action.infoValue
      );
      return Immutable.merge(state, {
        currentSectionData: [sectionDataWithUpdatedFieldInfo]
      });
    case 'DEAL_SECTION_FIELD_REORDER':
      const reOrderedSection = reOrderFields(
        action.data,
        action.source,
        action.destination
      );
      // console.log('reOrderedSection', reOrderedSection);
      return Immutable.merge(state, {
        currentSectionData: [reOrderedSection],
        dealFieldsAreReordered: true
      });
    case 'DEAL_SECTION_FIELD_REORDER_RESET':
      return Immutable.merge(state, {
        dealFieldsAreReordered: false
      });
    case DEAL_SINGLE_FIELD_UPDATE:
      const updatedSection = updateSingleFieldData(state.currentSectionData[0], action.data.data);
      return Immutable.merge(state, {
        currentSectionData: [updatedSection],
        dealFieldsAreReordered: false
      }, { deep: true });
    case 'RESET_DEAL_DETAIL':
      return Immutable.merge(state, {
        dealFieldsAreReordered: false,
        currentSectionData: [],
        currentSectionDataUpdated: false,
        dealSections: [],
        isUsingOldConfig: false,
        isDealSectionChanged: false,
        sectionGroups: [],
        selectedGroups: [],
        showDealError: false
      });
    case 'DEAL_INVESTMENT_STATUSES':
      return Immutable.merge(state, {
        investmentStatuses: action.data?.data || []
      });
    case DEAL_DOCUMENT_VALIDATION_UPDATE:
      return Immutable.merge(state, {
        dealDocValidation: {
          ...action.data?.data,
          dealCode: state.deal?.data.dealCode
        } || {}
      });
    default:
      return state;
  }
};
