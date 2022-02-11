import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Performanceinfo from './performanceInfo';
import validate from './validate';
import { submitPerformanceInfo, getPerformanceDetail } from '../../../saga';
import { getPosMachineStatus, formatOtherArray } from '../../../../../utils/utils';

const PerformanceInfoFormWrapper = reduxForm({
  form: 'brandPerformanceInfo',
  validate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(Performanceinfo);

const posMachineList = ['Pine Labs',
  'MSwipe', 'BharatPe', 'India Transact'];

const outletCitiesList = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad',
  'Kolkata', 'Chennai', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Ahmedabad'];

const paymentGateWayList = ['RazorPay', 'PayTm', 'EBS', 'Cashfree'];

const mapStateToProps = ({ brandReducer }) => {
  const posMachineValues = (brandReducer.formData.data && brandReducer.formData.data.posMachines
    && formatOtherArray(brandReducer.formData.data.posMachines, posMachineList)) || { list: [], others: '' };
  const outletCitiesValue = (brandReducer.formData.data && brandReducer.formData.data.outletCities
    && formatOtherArray(brandReducer.formData.data.outletCities, outletCitiesList)) || { list: [], others: '' };
  const paymentGatewayValue = (brandReducer.formData.data && brandReducer.formData.data.paymentGateways
    && formatOtherArray(brandReducer.formData.data.paymentGateways, paymentGateWayList)) || { list: [], others: '' };
  return ({
    performanceInfoUpdate: brandReducer.performanceInfoUpdate,
    formData: brandReducer.formData,
    initialValues: {
      channelsOfSale: brandReducer.formData.data.channelsOfBusiness,
      platformsOfSale: brandReducer.formData.data.onlineChannels,
      numberOfOutlets: brandReducer.formData.data.noOfOutlets,
      geographicalPresence: outletCitiesValue.list,
      otherLocation: outletCitiesValue.others,
      posMachineAvailability: brandReducer.formData.data.hasPosMachines
      && getPosMachineStatus(brandReducer.formData.data.hasPosMachines),
      posMachines: posMachineValues.list,
      latesAuditedTO: brandReducer.formData.data.lastAuditedTurnover,
      currentYearTO: brandReducer.formData.data.currentYearTurnover,
      ebitda: brandReducer.formData.data.ebitdaPercent,
      lastMonthRevenue: brandReducer.formData.data.lastMonthRevenue,
      grossMargin: brandReducer.formData.data.grossMargin,
      tenure: brandReducer.formData.data.tenure,
      detailedBusinessNote: brandReducer.formData.data.detailedBusinessNote,
      otherPOSMachines: posMachineValues.others,
      paymentGateWayList: paymentGatewayValue.list,
      otherPaymentGateWay: paymentGatewayValue.others
    }
  });
};

const mapDispatchToProps = (dispatch) => ({
  submitPerformanceInfo,
  getPerformanceDetail,
  clearUpdateStatus: () => {
    dispatch({ type: 'BRAND_LEAD:PERFORMANCE_DETAIL:UPDATE_STATUS:CLEAR' });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceInfoFormWrapper);
