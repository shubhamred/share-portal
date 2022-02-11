import { BRAND_LEAD_APPLICANT_DETAIL_SUCCESS } from 'app/actions';
import { reducerTest } from 'app/utils/utils';
import brandReducer from '../reducer';

describe('Brand Reducer Test', () => {
  it('BRAND_LEAD_APPLICANT_DETAIL_SUCCESS', () => {
    const action = { type: BRAND_LEAD_APPLICANT_DETAIL_SUCCESS,
      data: {
        data: []
      } };
    const resultState = { applicantDetailsUpdate: 'success',
      formData: {
        data: []
      } };
    reducerTest(brandReducer, {}).expect(action).toReturn(resultState);
  });
});
