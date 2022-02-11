/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/button-has-type */
import * as React from 'react';
// import PropTypes from 'prop-types';
import styles from './styles.scss';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick: () => void;
  style?: any;
  disabled?: boolean;
  label?: string;
  title?: string;
}

const Button: React.FC<ButtonProps> = (props) => (
  <button
    type={props.type}
    onClick={() => props.onClick()}
    className={props.disabled ? styles.disabled : styles.btn}
    style={props.style}
    disabled={props.disabled}
    title={props.title || ''}
  >
    {props.label}
  </button>
);

// Button.propTypes = {
//   disabled: PropTypes.bool,
//   label: PropTypes.string,
//   onClick: PropTypes.func,
//   type: PropTypes.string
// };

Button.defaultProps = {
  disabled: false,
  label: '',
  onClick: () => {},
  type: 'button',
  style: {},
  title: ''
};

export default Button;
