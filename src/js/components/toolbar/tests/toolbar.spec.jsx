/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Toolbarcomponent from 'app/components/toolbar';

configure({ adapter: new Adapter() });

describe('components/Toolbarcomponent', () => {
  it('should render with default', () => {
    const component = shallow(
      <Toolbarcomponent title="Dummy Title" />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with button', () => {
    const props = {
      title: 'Dummy Title',
      actions: [
        {
          label: 'Button label',
          variant: 'contained',
          color: 'secondary',
          onClick: jest.fn()
        }
      ]
    };
    const component = mount(
      <Toolbarcomponent {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
    component.find('button').simulate('click');
    expect(props.actions[0].onClick).toBeCalled();
  });
  it('should render with ICON', () => {
    const props = {
      title: 'Dummy Title',
      actions: [
        {
          icon: 'Button label',
          label: 'Label',
          onClick: jest.fn()
        }
      ]
    };
    const component = mount(
      <Toolbarcomponent {...props} />
    );
    component.find('button').simulate('click');
    expect(props.actions[0].onClick).toBeCalled();
  });
  it('should render with Component', () => {
    const props = {
      title: 'Dummy Title',
      actions: [
        {
          component: <p>Button label</p>
        }
      ]
    };
    const component = mount(
      <Toolbarcomponent {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
