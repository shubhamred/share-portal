import React from 'react';
import { shallow, configure } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Customtable from '../index';

configure({ adapter: new Adapter() });

describe('components/TableNew', () => {
  // it('Renders default options', () => {
  //   const components = mount(
  //     <Customtable />
  //   );
  //   const tree = shallowToJson(components);
  //   expect(tree).toMatchSnapshot();
  // });
  it('Renders with table options', () => {
    const props = {
      tableColumns: [{ Header: 'Dummy ID', accessor: 'dummyId' }, { Header: 'Dummy Name', accessor: 'dummyName' }],
      tableData: [{ dummyId: '1', dummyName: 'Dummy Name 1' }, { dummyId: '2', dummyName: 'Dummy Name 2' }],
      totalCount: 2
    };
    const component = shallow(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Customtable {...props} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
