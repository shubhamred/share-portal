import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CustomTabs from '../customTabs';

configure({ adapter: new Adapter() });

describe('components/Custom Tabs', () => {
  it('Renders default options', () => {
    const component = shallow(
      <CustomTabs />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  describe('Renders with options', () => {
    const props = {
      tabs: ['tab1', 'tab2'],
      activeTab: 'tab1',
      handleTabClick: jest.fn()
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <CustomTabs {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
    it('should execute handleClick', () => {
      component.findWhere((node) => node.key() === 'tab2').children().simulate('click');
      expect(props.handleTabClick).toHaveBeenCalledTimes(1);
    });
  });
});
