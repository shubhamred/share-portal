import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import CloseButton from '../closeButton';

configure({ adapter: new Adapter() });

describe('components/Close Button', () => {
  it('Renders default options', () => {
    const component = shallow(
      <CloseButton />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('handles click', () => {
    const props = {
      onCloseButtonClick: jest.fn()
    };
    const component = shallow(
      <CloseButton onCloseButtonClick={props.onCloseButtonClick} />
    );
    component.simulate('click');
    expect(props.onCloseButtonClick).toHaveBeenCalledTimes(1);
  });
});
