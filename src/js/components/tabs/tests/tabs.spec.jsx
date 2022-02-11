import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Tabs from '../tabs';

configure({ adapter: new Adapter() });

describe('components/Tabs', () => {
  it('Renders default options', () => {
    const component = shallow(
      <Tabs />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      tabList: [{ label: 'TAB1', content: <p>tab 1</p> }, { label: 'TAB 2', content: <p>tab 2</p> }],
      value: 0
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Tabs {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('Handles tab change', () => {
    const props = {
      tabList: [{ label: 'TAB1', content: <p>tab 1</p> }, { label: 'TAB 2', content: <p>tab 2</p> }],
      value: 0
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Tabs {...props} />
    );
    component.find('#tab-1 button').simulate('click');
  });
});
