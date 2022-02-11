import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import AdornmentInput from '../adornmentInput';

configure({ adapter: new Adapter() });

describe('components/AdornmentInput', () => {
  it('Renders default options', () => {
    const component = shallow(
      <AdornmentInput />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
