import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Router } from 'react-router-dom';
import CustomPaginationActionsTable from '../paginatedTable';

configure({ adapter: new Adapter() });

// let CustomPaginationActionsTableWrapper;

describe('components/CustomPaginationActionsTable', () => {
  it(`match's snapshot`, () => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        push: jest.fn()
      })
    }));
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    const component = shallow(
      <Router history={historyMock}>
        <CustomPaginationActionsTable />
      </Router>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
    jest.clearAllMocks();
  });
  it(`Renders with Props`, () => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        push: jest.fn()
      })
    }));
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };
    const props = {
      dataTableType: 'deals',
      fetchNextData: jest.fn(),
      totalCount: 10,
      columns: ['Column 1', 'Column 2'],
      rowsPerPage: 10,
      setRowsPerPage: jest.fn(),
      page: 0,
      setPage: jest.fn(),
      rows: [{ column1: 'dummy 1' }, { column2: 'dummy 2' }],
      rowNames: ['column1', 'column2']
    };
    const component = shallow(
      <Router history={historyMock}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <CustomPaginationActionsTable {...props} />
      </Router>
    );
    const tree = shallowToJson(component);
    expect(tree)
      .toMatchSnapshot();
    jest.clearAllMocks();
  });
});
