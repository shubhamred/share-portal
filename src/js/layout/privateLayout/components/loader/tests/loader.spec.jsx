import React from 'react';
import { Provider } from 'react-redux';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import FullScreenLoader from '../index';

const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

describe('components/FullScreenLoader', () => {
  it('Show Loader', () => {
    const store = mockStore({
      errorRed: {
        showLoader: true
      }
    });
    const component = mount(
      <Provider store={store}>
        <FullScreenLoader />
      </Provider>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
  it('Hide Loader', () => {
    const store = mockStore({
      errorRed: {
        showLoader: false
      }
    });
    const component = mount(
      <Provider store={store}>
        <FullScreenLoader />
      </Provider>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
});
