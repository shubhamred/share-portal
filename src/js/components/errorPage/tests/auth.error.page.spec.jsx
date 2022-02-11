import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import AuthErrorPage from '../auth.error.page';

configure({ adapter: new Adapter() });

describe('components/Auth Error page', () => {
  it('renders correctly', () => {
    const component = shallow(
      <AuthErrorPage message="Error" />
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
  it('renders With props', () => {
    const component = shallow(
      <AuthErrorPage message="Error" />
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
});
