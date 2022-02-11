// import reducers
import { reducer as formReducer } from 'redux-form';
import brandReducer from '../containers/brands/reducer';
import patronReducer from '../containers/patrons/reducer';
import dealReducer from '../containers/deals/reducer';
import remarksReducer from '../containers/remarks/reducer';
import loyaltyReducer from '../containers/loyalty/reducer';
import repaymentsReducer from '../containers/repayments/reducer';
import { errorReducer } from '../layout/privateLayout/components/snackbar/index';

export default {
  // export reducers
  form: formReducer,
  errorRed: errorReducer,
  brandReducer,
  patronReducer,
  dealReducer,
  remarksReducer,
  loyaltyReducer,
  repaymentsReducer
};
