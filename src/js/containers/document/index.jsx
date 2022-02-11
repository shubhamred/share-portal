import { connect } from 'react-redux';
import { BRAND_LEAD_DOCUMENT_CONFIG_DATA_CLEAR, PATRON_LEAD_DOCUMENT_CONFIG_DATA_CLEAR } from 'app/actions';
import DocumentList from './document';

const mapDispatchToProps = (dispatch) => ({
  clearBrandValues: () => dispatch({ type: BRAND_LEAD_DOCUMENT_CONFIG_DATA_CLEAR }),
  clearPatronValues: () => dispatch({ type: PATRON_LEAD_DOCUMENT_CONFIG_DATA_CLEAR })
});

export default connect(null, mapDispatchToProps)(DocumentList);
