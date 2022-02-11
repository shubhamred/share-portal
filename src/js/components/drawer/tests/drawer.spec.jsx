import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Drawer from '../drawer';

configure({ adapter: new Adapter() });

describe('components/drawer', () => {
  it('Renders default options', () => {
    const props = {
      children: <p> test </p>
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const component = shallow(
      <Drawer {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  describe('Check for click handle', () => {
    const props = {
      children: <p> test </p>,
      open: false,
      title: 'dummy',
      handleClose: jest.fn()
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const ButtonComponentWrapper = shallow(<Drawer {...props} />);

    it('check prop type children should not be empty', () => {
      expect(ButtonComponentWrapper.props().children).toBeTruthy();
    });

    it('should handle click', () => {
      ButtonComponentWrapper.simulate('click');
    });
  });
});
