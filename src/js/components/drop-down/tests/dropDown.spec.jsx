import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import DropDown from '../dropDown';

configure({ adapter: new Adapter() });

describe('components/dropDown', () => {
  it('Renders default options', () => {
    const component = shallow(
      <DropDown />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      label: 'Dummy',
      disabled: false,
      input: {
        onChange: jest.fn(),
        value: ''
      },
      handleSelectedOption: jest.fn(),
      placeholder: 'Placeholder',
      options: [{ key: 'test1', value: 'test1' }]
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <DropDown {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with disabled options', () => {
    const props = {
      disabled: true,
      label: 'Dummy',
      input: {
        onChange: jest.fn(),
        value: ''
      },
      handleSelectedOption: jest.fn(),
      placeholder: 'Placeholder',
      options: [{ key: 'test1', value: 'test1' }],
      selectedOption: 'Other',
      isOtherFieldRequired: true
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <DropDown {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
