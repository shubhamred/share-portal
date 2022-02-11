import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Button from '../button';

configure({ adapter: new Adapter() });

describe('components/button', () => {
  it('Renders default options', () => {
    const component = shallow(
      <Button onClick={jest.fn()} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('Renders disabled options', () => {
    const component = shallow(
      <Button disabled={true} onClick={jest.fn()} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  describe('Check for click handle', () => {
    const props = {
      disabled: false,
      label: 'dummy',
      onClick: jest.fn()
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const ButtonComponentWrapper = shallow(<Button {...props} />);

    it('check prop type children should not be empty', () => {
      expect(ButtonComponentWrapper.props().children).toBeTruthy();
    });

    it('should handle click', () => {
      ButtonComponentWrapper.simulate('click');
    });
  });
});
