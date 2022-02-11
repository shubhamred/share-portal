import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Header from '../index';

configure({ adapter: new Adapter() });

describe('components/breadcrumb', () => {
  it('Renders default options', () => {
    const component = shallow(<Header />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
