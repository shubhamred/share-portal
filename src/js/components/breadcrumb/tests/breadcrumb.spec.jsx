import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Breadcrumbs from '../breadcrumb';

configure({ adapter: new Adapter() });

describe('components/breadcrumb', () => {
  it('Renders default options', () => {
    const component = shallow(<Breadcrumbs />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  describe('Check for click handle', () => {
    const props = {
      BreadcrumbsArray: []
    };
    // eslint-disable-next-line react/jsx-props-no-spreading
    const ButtonComponentWrapper = shallow(<Breadcrumbs {...props} />);

    it('check prop type children should not be empty', () => {
      expect(ButtonComponentWrapper.props().children).toBeTruthy();
    });
  });
});
