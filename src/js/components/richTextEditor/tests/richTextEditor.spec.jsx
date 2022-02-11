/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import RichTextEditor from '../index';

configure({ adapter: new Adapter() });

describe('components/RichTextEditor', () => {
  it('should render with props', () => {
    const props = {
      label: 'Label',
      propValue: '<p>Text Value</p>',
      onValueChange: jest.fn()
    };
    const component = shallow(
      <RichTextEditor {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });

  // it('should handle change', () => {
  //   const props = {
  //     label: 'Label',
  //     propValue: '<p>Text Value</p>',
  //     onValueChange: jest.fn()
  //   };
  //   const components = mount(
  //     <RichTextEditor {...props} />
  //   );
  //   // components.find('textarea').simulate('change', { target: { value: '<p>Text Values</p>' } });
  //   const tree = shallowToJson(components);
  //   expect(tree)
  //     .toMatchSnapshot();
  // });
});
