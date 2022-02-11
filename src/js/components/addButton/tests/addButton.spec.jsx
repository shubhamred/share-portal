import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import AddButton from '../addButton';

configure({ adapter: new Adapter() });

describe('components/Add Button', () => {
  it('Renders default options', () => {
    const component = shallow(
      <AddButton />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
  it('handles click', () => {
    const props = {
      onClick: jest.fn()
    };
    const component = shallow(
      <AddButton onClick={props.onClick} />
    );
    component.simulate('click');
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
