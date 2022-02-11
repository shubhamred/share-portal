import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Slider from '../slider';

configure({ adapter: new Adapter() });

const input = {
  onChange: jest.fn(),
  value: ''
};
describe('components/slider', () => {
  it('Renders default options', () => {
    const component = mount(
      <Slider input={input} marks={[{ value: 1, label: '1' }, { value: 50, label: '50' }]} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
