import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Input from '../input';

configure({ adapter: new Adapter() });

let InputComponent;
describe('components/Input', () => {
  it('Renders default options', () => {
    const input = {
      onChange: jest.fn()
    };
    const component = shallow(
      <Input input={input} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('Renders Disabled option and label', () => {
    const input = {
      onChange: jest.fn()
    };
    const component = shallow(
      <Input input={input} disabled={true} label="Demo" />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  describe('Render with selected value', () => {
    const props2 = {
      sectionList: ['dummy', 'dummy2'],
      selected: 'dummy',
      input: {
        onChange: jest.fn()
      },
      meta: {
        error: 'Error in input',
        submitFailed: true
      }
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    InputComponent = mount(<Input {...props2} />);
    it('check prop type children should not be empty', () => {
      expect(InputComponent.props()).toBeTruthy();
    });
    it('Handle On change', () => {
      InputComponent.find('input').simulate('change', { target: { value: 'Value' } });
      // expect(props2.input.onChange).toBeCalled();
    });
  });
  describe('Render with row ', () => {
    const props2 = {
      input: {
        value: 'dummy'
      },
      disabled: true,
      meta: {
        error: 'Error in input',
        submitFailed: false,
        dirty: true,
        invalid: true
      },
      row: true
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const component = mount(<Input {...props2} />);
    it('Match SnapShot ', () => {
      const tree = shallowToJson(component);
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Render with Extra Props', () => {
    const props2 = {
      sectionList: ['dummy', 'dummy2'],
      selected: 'dummy',
      input: {
        onChange: jest.fn()
      },
      hideButton: true,
      closeButton: true,
      onValueChange: jest.fn(),
      isFieldValue: false
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    InputComponent = mount(<Input {...props2} />);
    it('Handle on change', () => {
      InputComponent.find('input').simulate('change', { target: { value: 'Value' } });
      // expect(props2.onValueChange).toBeCalled();
    });
  });
  describe('Handles input chnage', () => {
    const props2 = {
      sectionList: ['dummy', 'dummy2'],
      selected: 'dummy',
      input: {
        onChange: jest.fn()
      },
      hideButton: true,
      closeButton: true,
      onValueChange: jest.fn(),
      isFieldValue: true
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    InputComponent = mount(<Input {...props2} />);
    it('Handle on change', () => {
      InputComponent.find('input').simulate('change', { target: { value: 'Value' } });
      expect(props2.input.onChange).toBeCalled();
    });
  });
});
