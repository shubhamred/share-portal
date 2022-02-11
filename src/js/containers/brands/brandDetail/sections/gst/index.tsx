import * as React from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { getCompanyGstDetails } from 'app/containers/brands/saga';
import {
  Context,
  getVerifiedImage,
  getHashPositionValue
} from 'app/utils/utils';
import GstOverview from './sections/overview';
import GstConsolidated from './sections/consolidated';
import IndividualGST from './sections/singleGST';
import { getStateName } from './sections/addGst/gstStatesList';

type BrandGstTS = {
  company: any;
  position: number;
  setBreadcrumbsData: (
    arg1: string,
    arg2: number,
    arg3?: boolean,
    arg5?: () => void,
    arg4?: boolean
  ) => void;
};

type TabListTS = {
  label: string;
  sLabel: string;
  content: any;
};

type HandleChangeTS = (newValue: number) => void

const BrandGst: React.FC<BrandGstTS> = (props) => {
  const { company, position, setBreadcrumbsData } = props;
  let tabRef: any = null;

  const [gstAccList, setGstAccList] = React.useState([]);

  const TABS_LIST = [
    {
      label: 'GST',
      sLabel: 'GST',
      content: <GstOverview />
    },
    {
      label: 'Consolidated',
      sLabel: 'Consolidated',
      content: <GstConsolidated />
    }
  ];

  // eslint-disable-next-line no-unused-vars
  const [tabsList, setTabsList] = React.useState<TabListTS[]>([]);

  const query = {
    where: {
      resourceCode: ''
    },
    take: 50
  };

  function getGstData() {
    query.where.resourceCode = company?.companyCode;
    getCompanyGstDetails(query).then((res) => {
      if (res.data) {
        setGstAccList(res.data);
        const gstsComponent = res.data.map((gstAcc: any) => ({
          label: (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 12%',
                width: '100%'
              }}
            >
              {getStateName(gstAcc.stateCode)}
              {getVerifiedImage(gstAcc, 'isVerified')}
            </div>
          ),
          sLabel: getStateName(gstAcc.stateCode),
          content: <IndividualGST gstId={gstAcc.id} gst={gstAcc} />
        }));
        urlManager([...TABS_LIST, ...gstsComponent]);
      } else {
        urlManager([...TABS_LIST]);
      }
    });
  }

  const urlManager = (listOfData = TABS_LIST) => {
    setTabsList(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(
          mData.replace('#', '').replace(new RegExp('_', 'g'), ' '),
          'i'
        );
        const TabValue = listOfData.findIndex(
          (list) => list.sLabel.match(re) !== null
        );
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].sLabel, position);
        } else {
          setBreadcrumbsData(
            listOfData[TabValue].sLabel,
            position,
            false,
            () => {},
            true
          );
        }
      } else {
        setBreadcrumbsData(listOfData[0].sLabel, position);
      }
    }
  };

  React.useEffect(() => {
    if (company?.companyCode) {
      getGstData();
    }
  }, [company, tabRef]);

  const handleChange: HandleChangeTS = (newValue) => {
    setBreadcrumbsData(
      tabsList[newValue].sLabel,
      position,
      false,
      () => {},
      true
    );
  };

  const tabHandler: HandleChangeTS = (newValue) => {
    if (tabRef) {
      tabRef(newValue);
      setBreadcrumbsData(
        tabsList[newValue].sLabel,
        position,
        false,
        () => {},
        true
      );
    }
  };

  return (
    <Context.Provider
      value={{
        gstList: gstAccList,
        getGstData,
        company,
        tabHandler
      }}
    >
      <Grid container={true}>
        <Grid item={true} xs={12}>
          <Tabs
            tabList={tabsList}
            refTab={(ref) => {
              tabRef = ref;
            }}
            scrollable={true}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Context.Provider>
  );
};

export default BrandGst;
