// eslint-disable-next-line max-len
import { validateEmail, validateMobile, validatePincode, validateBusinessPAN, validateIndividualPAN, validateGSTIN, validateName, formatDate, formatDateStandard, convertISO, filterDocumentBasedOnStatus, getPosMachineStatus } from '../utils';

describe('Utils Test', () => {
  it('validateEmail should Return Boolean', () => {
    expect(validateEmail('dummt@email.com')).toBeTruthy();
    expect(validateEmail('dummt@email')).toBeFalsy();
  });
  it('validateMobile should return Boolean', () => {
    expect(validateMobile('+919809809809')).toBeTruthy();
    expect(validateMobile('+919876543')).toBeFalsy();
  });
  it('validatePincode should return Boolean', () => {
    expect(validatePincode('560024')).toBeTruthy();
    expect(validatePincode('5c56')).toBeFalsy();
  });
  it('validateBusinessPAN should return Boolean', () => {
    expect(validateBusinessPAN('ABCFE0001Y')).toBeTruthy();
    expect(validateBusinessPAN('ABCFE000S1Yy')).toBeFalsy();
  });
  it('validateIndividualPAN should return Boolean', () => {
    expect(validateIndividualPAN('ABCFE0001Y')).toBeTruthy();
    expect(validateIndividualPAN('ABCFE000S1Yy')).toBeFalsy();
  });
  it('validateGSTIN should return Boolean', () => {
    expect(validateGSTIN('12TNSHT3456ASZF')).toBeTruthy();
    expect(validateGSTIN('12THT3456ASZF')).toBeFalsy();
  });
  it('validateName should return Boolean', () => {
    expect(validateName('testmame')).toBeTruthy();
    expect(validateName('THT3456ASZF')).toBeFalsy();
  });
  it('formatDate should return Valid Date', () => {
    expect(formatDate('2020-06-09T04:38:52.656Z')).toBe('09-06-2020');
    expect(formatDate('DUMMY')).toBeFalsy();
  });
  it('formatDateStandard should return Valid Date', () => {
    expect(formatDateStandard('2020-06-09T04:38:52.656Z')).toBe('09/06/2020');
    expect(formatDateStandard('DUMMY')).toBeFalsy();
  });
  it('convertISO should return Valid Date', () => {
    expect(convertISO('2020-06-09T04:38:52.656Z')).toBe('9-6-2020');
  });

  it('should sort based on status', () => {
    const arr = [{ id: 1, status: 'active' }, { id: 2, status: 'draft' }, { id: 3, status: 'inactive' }];
    expect(filterDocumentBasedOnStatus(arr, 'active')).toStrictEqual([{ id: 1, status: 'active' }]);
  });

  it('should return associated value of input', () => {
    expect(getPosMachineStatus(true)).toBe('Yes');
    expect(getPosMachineStatus(false)).toBe('No');
  });
});
