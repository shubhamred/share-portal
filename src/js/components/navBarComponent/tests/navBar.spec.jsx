import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import NavBar from '../navBar';

configure({ adapter: new Adapter() });

let NavBarComponent;

describe('components/Navbar', () => {
  it('renders correctly', () => {
    const component = shallow(
      <NavBar />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  describe('render with single prop', () => {
    const props = {
      sectionList: ['dummy'],
      selectedSection: 'dummy',
      handleNavClick: jest.fn()
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    NavBarComponent = shallow(<NavBar {...props} />);

    it('check prop type children should not be empty', () => {
      expect(NavBarComponent.props().children).toBeTruthy();
    });

    it('check props length is greater >= 2', () => {
      expect(Object.keys(NavBarComponent.props()).length).toBeGreaterThan(1);
    });
  });
  describe('Render with 2 props to fill coverage ', () => {
    const props2 = {
      sectionList: ['dummy', 'dummy2'],
      selectedSection: 'dummy',
      handleNavClick: jest.fn()
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    NavBarComponent = shallow(<NavBar {...props2} />);
    it('check prop type children should not be empty', () => {
      expect(NavBarComponent.props().children).toBeTruthy();
    });

    it('should execute handleClick', () => {
      NavBarComponent.findWhere((node) => node.key() === 'dummy2').simulate('click');
      expect(props2.handleNavClick).toHaveBeenCalledTimes(1);
    });
  });
});
