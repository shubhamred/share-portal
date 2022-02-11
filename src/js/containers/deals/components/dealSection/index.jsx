import { connect } from 'react-redux';
import DealSection from './dealSection';

const mapStateToProps = ({ dealReducer }) => ({
  dealConfig: dealReducer.dealConfig,
  dealDataSections: dealReducer.dealSections,
  deal: dealReducer.deal,
  dealHeaderFormUpdated: dealReducer.dealHeaderFormUpdated,
  isOldDeal: dealReducer.isUsingOldConfig
});

const mapDispatchToProps = (dispatch) => ({
  changeSectionVisibility: (visibilityValue, sectionName) => {
    dispatch({ type: 'DEAL_SECTION_VISIBILITY:CHANGE', visibilityValue, sectionName });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DealSection);
