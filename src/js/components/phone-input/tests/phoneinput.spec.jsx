/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import PhoneInput from '../phoneInput';

configure({ adapter: new Adapter() });

describe('components/phoneInput', () => {
  it('Renders default options', () => {
    const component = shallow(
      <PhoneInput />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      label: 'Dummy label',
      propValue: '99999999',
      input: {
        onChange: jest.fn()
      },
      handlePhoneNumberChange: jest.fn()
    };
    const component = shallow(
      <PhoneInput {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with error options', () => {
    const props = {
      label: 'Dummy label',
      propValue: '99999999',
      input: {
        onChange: jest.fn()
      },
      handlePhoneNumberChange: jest.fn(),
      meta: {
        error: 'Invalid Number',
        submitFailed: true
      }
    };
    const component = shallow(
      <PhoneInput {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with Disabled options', () => {
    const props = {
      disabled: true,
      label: 'Dummy label',
      propValue: '99999999',
      input: {
        onChange: jest.fn()
      },
      handlePhoneNumberChange: jest.fn(),
      meta: {
        error: 'Invalid Number',
        submitFailed: true
      }
    };
    const component = shallow(
      <PhoneInput {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  // it('Handles On change', () => {
  //   const props = {
  //     label: 'Dummy label',
  //     propValue: '+9199999999',
  //     input: {
  //       onChange: jest.fn()
  //     },
  //     handlePhoneNumberChange: jest.fn(),
  //     meta: {
  //       error: 'Invalid Number',
  //       submitFailed: true
  //     }
  //   };
  //   const components = mount(
  //     <PhoneInput {...props} />
  //   );
  // components.find('input').simulate('change');
  // console.log(components.debug());
  //  components.find('input[type="phone"]').simulate('change', '+9199999998');

  // expect(props.handlePhoneNumberChange).toBeCalled();
  // expect(props.input.onChange).toBeCalled();
  // });
});
