// @flow
import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import DialogComponent from '../dialogComponent';

configure({ adapter: new Adapter() });

describe('Components/DialogComponent', () => {
  it('Renders default DialogComponent', () => {
    const props = {
      children: <p>Test</p>
    };
    const component = shallow(
      <DialogComponent {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
