import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import HideButton from '../hideButton';

configure({ adapter: new Adapter() });

describe('components/dropDown', () => {
  it('Renders default options', () => {
    const component = shallow(
      <HideButton />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('handles click', () => {
    const props = {
      onHideBtnClick: jest.fn(),
      visible: true,
      isSection: true
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <HideButton {...props} />
    );
    component.simulate('click');
    expect(props.onHideBtnClick).toHaveBeenCalledTimes(1);
  });
});
