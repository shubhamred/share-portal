import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import TabSelector from '../tabSelector';

configure({ adapter: new Adapter() });

describe('components/Tab Selctor', () => {
  it('Renders default options', () => {
    const props = {
      menuItems: []
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <TabSelector {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with Props', () => {
    const props = {
      menuItems: [{ id: 'dummyId1', name: 'Dummy 1' }, { id: 'dummyId2', name: 'Dummy 2' }],
      selectedTab: 'dummyId1'
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <TabSelector {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Components hadles On click', () => {
    const props = {
      menuItems: [{ id: 'dummyId1', name: 'Dummy 1' }, { id: 'dummyId2', name: 'Dummy 2' }],
      selectedTab: 'dummyId1',
      onChangeTab: jest.fn()
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <TabSelector {...props} />
    );
    component.findWhere((node) => node.key() === 'dummyId1').children().simulate('click');
    expect(props.onChangeTab).toHaveBeenCalledTimes(1);
  });
});
