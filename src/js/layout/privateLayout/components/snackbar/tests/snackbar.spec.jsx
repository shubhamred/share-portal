import React from 'react';
import { Provider } from 'react-redux';
import { mount, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import Snackbar from '../index';

const mockStore = configureStore([]);

configure({ adapter: new Adapter() });

describe('components/Snackbar', () => {
  let store;
  let component;

  it('renders correctly on show', () => {
    store = mockStore({
      errorRed: {
        show: true,
        message: 'Test Message',
        type: 'error'
      }
    });
    component = mount(
      <Provider store={store}>
        <Snackbar />
      </Provider>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
  it('renders correctly on Array of messages', () => {
    store = mockStore({
      errorRed: {
        show: true,
        message: ['Test Message 1', 'Test Message 2'],
        type: 'error'
      }
    });
    component = mount(
      <Provider store={store}>
        <Snackbar />
      </Provider>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
  it('renders correctly on hide', () => {
    store = mockStore({
      errorRed: {
        show: false,
        message: 'Test Message',
        type: 'error'
      }
    });
    component = mount(
      <Provider store={store}>
        <Snackbar />
      </Provider>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
  });
});
