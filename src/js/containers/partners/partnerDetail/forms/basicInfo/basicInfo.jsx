import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { getHashPositionValue } from 'app/utils/utils';
import { resourceTypes } from 'app/utils/enums';
import { Tabs, CustomeHeader } from '../../../../../components';
import Overview from './components/overview';
import Address from './components/address';
import styles from './styles.scss';

const BasicInfo = (props) => {
  const { partnerDetail, setBreadcrumbsData, position, saveAddAddress, updateAddress } = props;
  let tabRef = null;
  const [tabs, setTabs] = useState([]);

  // const [openStatusDialog, setOpenStatusDialog] = useState(false);

  const handleSubmit = (values) => {
    if (values?.addressId) {
      updateAddress({ ...values, id: values.addressId, resourceId: partnerDetail.id, resourceCode: partnerDetail.companyCode, resource: resourceTypes.NBFC });
    } else {
      saveAddAddress({ ...values, id: partnerDetail.id, resourceCode: partnerDetail.companyCode, resource: resourceTypes.NBFC });
    }
  };

  useEffect(() => {
    if (tabRef && partnerDetail) {
      urlManager([
        { label: 'Overview', content: <Overview /> },
        {
          label: 'Address',
          content: (
            <Address onSubmit={handleSubmit} />
          )
        }
      ]);
    }
  }, [tabRef, partnerDetail]);

  const urlManager = (listOfData) => {
    setTabs(listOfData);
    if (tabRef) {
      const mData = getHashPositionValue(position - 2);
      if (mData) {
        const re = new RegExp(mData.replace('#', '').replace(new RegExp('_', 'g'), ' '), 'i');
        const TabValue = listOfData.findIndex((list) => list.label.match(re) !== null);
        if (TabValue >= 0) {
          tabRef(TabValue);
          setBreadcrumbsData(listOfData[TabValue].label, position);
        } else {
          setBreadcrumbsData(listOfData[TabValue].label, position, false, () => {}, true);
        }
      } else {
        setBreadcrumbsData(listOfData[0].label, position);
      }
    }
  };

  const handleChange = (newValue) => {
    setBreadcrumbsData(tabs[newValue].label, position, false, () => {}, true);
  };

  // const toolbarActions = [
  //   {
  //     label: (
  //       <div className={styles.statusWrapper}>
  //         {`Status : ${partnerDetail && partnerDetail.status}`}
  //         <img className={styles.editIcon} src="assets/editWhite.svg" alt="alt" />
  //       </div>
  //     ),
  //     onClick: () => setOpenStatusDialog(true)
  //   }
  // ];

  return (
    <Grid
      container={true}
      className={styles.wrapper}
      wrap="nowrap"
      direction="column"
    >
      <Grid item={true} xs={12}>
        <CustomeHeader
          pageName=""
          // actions={toolbarActions}
          isSearch={false}
          isFilter={false}
        />
      </Grid>
      <Grid
        className={styles.contentWrapper}
        container={true}
        item={true}
        direction="row"
      >
        <Tabs tabList={tabs} refTab={(ref) => { tabRef = ref; }} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

BasicInfo.propTypes = {
  position: PropTypes.number,
  partnerDetail: PropTypes.shape({}),
  setBreadcrumbsData: PropTypes.func
};

BasicInfo.defaultProps = {
  position: 0,
  partnerDetail: {},
  setBreadcrumbsData: () => {}
};

export default BasicInfo;
