import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Tooltip from '../tooltip';

configure({ adapter: new Adapter() });

const props = {
  onChange: jest.fn(),
  value: '',
  children: <p>Test</p>,
  title: 'Test'
};
describe('components/slider', () => {
  it('Renders default options', () => {
    const component = mount(
      <Tooltip {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
