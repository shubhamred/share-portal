import React from 'react';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import MultiSelect from '../index';

configure({ adapter: new Adapter() });

describe('components/Multi Select', () => {
  it('Renders default options', () => {
    const component = mount(
      <MultiSelect />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with disabled options', () => {
    const component = mount(
      <MultiSelect isDisabled={true} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with options', () => {
    const props = {
      classes: {
        flexContainer: 'dummyclass',
        doNothing: 'donothing',
        enabled: 'enabled'
      },
      isShowChips: false,
      listItems: [{ name: 'dummy1' }, { name: 'dummy2' }, { name: 'dummy3' }],
      selectedItems: ['dummy1']
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <MultiSelect {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders with chip enabled option', () => {
    const props = {
      classes: {
        flexContainer: 'dummyclass',
        doNothing: 'donothing',
        enabled: 'enabled'
      },
      chipLabel: 'dummyLabel',
      isShowChips: true,
      listItems: [{ name: 'dummy1' }, { name: 'dummy2' }, { name: 'dummy3' }],
      selectedItems: ['dummy1']
    };
    const component = mount(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <MultiSelect {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
