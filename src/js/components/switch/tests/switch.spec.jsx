import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Switch from '../switch';

configure({ adapter: new Adapter() });

describe('components/switch', () => {
  it('Renders default options', () => {
    const component = shallow(
      <Switch />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
