/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import AutocompleteComponent from '../index';

configure({ adapter: new Adapter() });
let AutocompleteComponentWrapper;
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
});
describe('components/Autocomplete Component', () => {
  it('Renders default options', () => {
    const input = {
      onChange: jest.fn(),
      value: ''
    };
    const component = shallow(
      <AutocompleteComponent input={input} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  describe('render with Object option prop', () => {
    const props = {
      options: [{ id: 1, name: 'option1', value: 'option1' }, { id: 2, name: 'option2', value: 'option2' }],
      selector: 'value',
      selectedOption: { id: 1, name: 'option1', value: 'option1' },
      handleSelectedOption: jest.fn(),
      isArray: false,
      input: {
        onChange: jest.fn(),
        value: { id: 1, name: 'option1', value: 'option1' }
      }
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    AutocompleteComponentWrapper = mount(<AutocompleteComponent {...props} />);
    it('check props length is greater >= 2', () => {
      expect(Object.keys(AutocompleteComponentWrapper.props()).length).toBeGreaterThan(1);
    });
  });
  describe('render with single prop', () => {
    const props = {
      options: ['dummy', 'dummy2'],
      selectedOption: 'dummy',
      handleSelectedOption: jest.fn(),
      input: {
        onChange: jest.fn(),
        value: 'dummy'
      },
      isArray: true,
      required: true,
      handleInputChange: jest.fn()
    };
    AutocompleteComponentWrapper = mount(<AutocompleteComponent {...props} />);
    AutocompleteComponentWrapper.find('.autoCompleteComponent input').simulate('change', { target: { value: 'The  Redemption' } });
    AutocompleteComponentWrapper.update();
    // console.log(AutocompleteComponentWrapper.find('.autoCompleteComponent input').props());
    it('Handles the onchange handler', () => {
      expect(AutocompleteComponentWrapper.props().handleInputChange).toHaveBeenCalled();
    });
  });
});
