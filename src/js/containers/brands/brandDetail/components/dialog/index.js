import { reduxForm } from 'redux-form';
import FormDialog from './dialog';

const validate = (values) => {
  const errors = {};
  if (!values.remarks || values.remarks === '') {
    errors.remarks = 'Please enter remarks';
  }
  if (!values.status || values.status === '') {
    errors.status = 'Status is required';
  }
  return errors;
};

const FormDialogWrapper = reduxForm({
  form: 'patronStatusUpdateForm',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true
})(FormDialog);

export default FormDialogWrapper;
