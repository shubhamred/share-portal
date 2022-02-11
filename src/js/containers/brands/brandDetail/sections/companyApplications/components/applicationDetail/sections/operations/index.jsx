import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useDispatch } from 'react-redux';
import {
  getBrandIntegrations,
  getApplicationIntegrations,
  getDealIntegrations,
  addApplicationIntegrations
} from 'app/containers/brands/saga';
import { Tooltip, AddButton, DialogComponent } from 'app/components';
import AddIntegration from './addIntegration';
import EditIntegration from './editIntegration';
// import { Bankdata } from '../data/dummy';
import style from '../../style.scss';

function Operation(props) {
  const { type, applicationCode, dealCode, brandCode } = props;
  const dispatch = useDispatch();
  const [openDialog, setOpenDialogstatus] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [pgData, setPgData] = useState([]);
  const [posData, setPosData] = useState([]);
  const [marketplaceData, setMarketplaceData] = useState([]);
  const [codData, setCodData] = useState([]);
  const [PGList, setPGList] = useState([]);
  const [PosList, setPosList] = useState([]);
  const [MarketplaceList, setMarketplaceList] = useState([]);
  const [CODList, setCODList] = useState([]);
  const [editData, setEditData] = useState([]);

  const editDialoghandler = (data) => {
    setOpenEditDialog(true);
    setEditData(data);
  };

  const tipContent = (data) => (
    <Grid className={style.tipContent}>
      <Grid className={style.actions} onClick={() => editDialoghandler(data)}>
        Edit account
      </Grid>
      {!data?.isPrimary && <div className={style.actionsBorder} />}
      {!data?.isPrimary && (
        <Grid className={style.actions} onClick={() => primaryHendler(data)}>
          Mark it as Primary account
        </Grid>
      )}
    </Grid>
  );

  useEffect(() => {
    if (type === 'application' && brandCode) {
      getBrandIntegrations(brandCode, '').then((res) => {
        if (res?.data?.length) {
          let PGData = res.data.filter((data) => data.category === 'PG');
          PGData = PGData.map((list) => ({
            label: list.type,
            value: list.type
          }));
          let POSData = res.data.filter((data) => data.category === 'POS');
          POSData = POSData.map((list) => ({
            label: list.type,
            value: list.type
          }));
          let MarketplaceData = res.data.filter((data) => data.category === 'MARKETPLACE');
          MarketplaceData = MarketplaceData.map((list) => ({
            label: list.type,
            value: list.type
          }));
          let CODData = res.data.filter((data) => data.category === 'COD');
          CODData = CODData.map((list) => ({
            label: list.type,
            value: list.type
          }));
          setPGList(PGData);
          setPosList(POSData);
          setMarketplaceList(MarketplaceData);
          setCODList(CODData);
        }
      });
    }

    if (type === 'deal' && applicationCode && brandCode) {
      getApplicationIntegrations(brandCode, applicationCode).then((res) => {
        if (res?.data) {
          setDataToState(res?.data, true);
        }
      });
    }
    loadData();
  }, [applicationCode, dealCode]);

  const loadData = () => {
    if (applicationCode && type === 'application') {
      getApplicationIntegrations(brandCode, applicationCode).then((res) => {
        if (res?.data) {
          setDataToState(res?.data);
        }
      });
    }
    if (dealCode && applicationCode && type === 'deal') {
      getDealIntegrations(brandCode, applicationCode, dealCode).then((res) => {
        if (res?.data) {
          setDataToState(res?.data);
        }
      });
    }
  };

  const primaryHendler = (data) => {
    const payload = {
      isPrimary: true,
      category: data?.category,
      type: data.name,
      splitPercentage: data?.split || 0,
      minContribution: data?.minContribution || 0
    };
    submitHandler(payload);
  };

  const setDataToState = (data, isSelect = false) => {
    if (data?.PG) {
      const PGData = Object.keys(data.PG).map((list) => ({
        name: list,
        category: 'PG',
        accountName: data.PG[list]?.accountName || '',
        accountNumber: data.PG[list]?.accountNumber || '',
        isPrimary: data.PG[list]?.isPrimary || false,
        split: data.PG[list]?.splitPercentage || 0,
        minContribution: data.PG[list]?.minContribution || 0
      }));
      if (!isSelect) setPgData(PGData);

      if (isSelect && PGData?.length) {
        const PGSelectData = PGData.map((list) => ({
          label: list.name,
          value: list.name
        }));
        setPGList(PGSelectData);
      }
    }

    if (data?.POS) {
      const POSData = Object.keys(data.POS).map((list) => ({
        name: list,
        category: 'POS',
        accountName: data.POS[list]?.accountName || '',
        accountNumber: data.POS[list]?.accountNumber || '',
        isPrimary: data.POS[list]?.isPrimary || false,
        split: data.POS[list]?.splitPercentage || 0,
        minContribution: data.POS[list]?.minContribution || 0
      }));
      if (!isSelect) setPosData(POSData);

      if (isSelect && POSData?.length) {
        const POSSelectData = POSData.map((list) => ({
          label: list.name,
          value: list.name
        }));
        setPosList(POSSelectData);
      }
    }

    if (data?.COD) {
      const CODData = Object.keys(data.COD).map((list) => ({
        name: list,
        category: 'COD',
        accountName: data.COD[list]?.accountName || '',
        accountNumber: data.COD[list]?.accountNumber || '',
        isPrimary: data.COD[list]?.isPrimary || false,
        split: data.COD[list]?.splitPercentage || 0,
        minContribution: data.COD[list]?.minContribution || 0
      }));
      if (!isSelect) setCodData(CODData);

      if (isSelect && CODData?.length) {
        const POSSelectData = CODData.map((list) => ({
          label: list.name,
          value: list.name
        }));
        setCODList(POSSelectData);
      }
    }

    if (data?.MARKETPLACE) {
      const MarketplaceData = Object.keys(data.MARKETPLACE).map((list) => ({
        name: list,
        category: 'MARKETPLACE',
        accountName: data.MARKETPLACE[list]?.accountName || '',
        accountNumber: data.MARKETPLACE[list]?.accountNumber || '',
        isPrimary: data.MARKETPLACE[list]?.isPrimary || false,
        split: data.MARKETPLACE[list]?.splitPercentage || 0,
        minContribution: data.MARKETPLACE[list]?.minContribution || 0
      }));
      if (!isSelect) setMarketplaceData(MarketplaceData);

      if (isSelect && MarketplaceData?.length) {
        const POSSelectData = MarketplaceData.map((list) => ({
          label: list.name,
          value: list.name
        }));
        setMarketplaceList(POSSelectData);
      }
    }
  };

  const handleOpenModal = () => {
    setOpenDialogstatus(!openDialog);
  };

  const submitHandler = async (data) => {
    const {
      category,
      type: integrationType,
      isPrimary,
      minContribution,
      splitPercentage
    } = data;
    const payload = {
      category,
      type: integrationType,
      isPrimary,
      applicationCode,
      brandCode,
      minContribution: Number(minContribution),
      splitPercentage: Number(splitPercentage)
    };

    if (type === 'deal') {
      payload.dealCode = dealCode;
    }

    const response = await addApplicationIntegrations(payload);
    if (response?.message) {
      dispatch({
        type: 'show',
        payload: response.message,
        msgType: 'error'
      });
    } else {
      setOpenDialogstatus(false);
      setOpenEditDialog(false);
      loadData();
    }
  };

  const accountHandler = (category = '', accountData = []) => (
    <Grid className={style.mainContainer}>
      <Grid className={style.heading2} item={true}>
        {category}
      </Grid>
      {accountData?.length
        ? accountData.map((row) => (
          <Grid className={style.mainContainer} container={true}>
            <Grid item={true} sm={8} md={9} lg={10}>
              <Grid container={true}>
                <Grid item={true} sm={3} md={3} lg={3}>
                  <Grid className={style.subHeader} item={true}>
                    Merchant Name
                  </Grid>
                  <Grid className={style.subHeaderValue} item={true}>
                    {row.name}
                  </Grid>
                </Grid>
                <Grid item={true} sm={3} md={3} lg={3}>
                  <Grid className={style.subHeader} item={true}>
                    Merchant ID
                  </Grid>
                  <Grid className={style.subHeaderValue} item={true}>
                    {row.accountNumber}
                  </Grid>
                </Grid>
                <Grid item={true} sm={3} md={3} lg={3}>
                  <Grid className={style.subHeader} item={true}>
                    Revenue Split
                  </Grid>
                  <Grid className={style.subHeaderValue} item={true}>
                    {row.split > 0 ? `${row.split}%` : '-'}
                  </Grid>
                </Grid>
                <Grid item={true} sm={3} md={3} lg={3}>
                  <Grid className={style.subHeader} item={true}>
                    Min Contribution
                  </Grid>
                  <Grid className={style.subHeaderValue} item={true}>
                    {row.minContribution > 0
                      ? `${row.minContribution}%`
                      : '-'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item={true} sm={4} md={3} lg={2}>
              <Grid
                className={style.actionContainer}
                container={true}
                justify={row.isPrimary ? 'space-between' : 'flex-end'}
              >
                {row.isPrimary ? (
                  <span className={style.isPrimary}>Primary account</span>
                ) : null}
                <Tooltip
                  anchorOriginVertical="center"
                  anchorOriginHorizontal="right"
                  transformOriginHorizontal="right"
                  title={tipContent(row)}
                >
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                  >
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        ))
        : 'No Data Found'}
    </Grid>
  );

  return (
    <Grid>
      <Grid className={style.mainContainer}>
        <Grid container={true}>
          <Grid item={true} md={12}>
            <Grid container={true} justify="flex-end">
              <AddButton onClick={handleOpenModal} label="Add Account" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {accountHandler('Marketplace', marketplaceData)}
      {accountHandler('COD', codData)}
      {accountHandler('Payment Gateway', pgData)}
      {accountHandler('PoS', posData)}
      {openDialog && (
        <DialogComponent
          title="Add Account"
          onClose={handleOpenModal}
          closeButton={true}
          customWidth="750px"
          customPadding="10px 10px 8px 10px"
          contentStyle={{ padding: '24px 18px 16px' }}
        >
          <AddIntegration
            onClose={handleOpenModal}
            onSubmit={submitHandler}
            PGTypeList={PGList}
            POSTypeList={PosList}
            MarketplaceTypeList={MarketplaceList}
            CODTypeList={CODList}
          />
        </DialogComponent>
      )}
      {openEditDialog && (
        <DialogComponent
          title="Edit Account"
          onClose={() => setOpenEditDialog(false)}
          closeButton={true}
          customWidth="750px"
          customPadding="10px 10px 8px 10px"
          contentStyle={{ padding: '24px 18px 16px' }}
        >
          <EditIntegration
            onClose={() => setOpenEditDialog(false)}
            onSubmit={submitHandler}
            config={editData}
          />
        </DialogComponent>
      )}
    </Grid>
  );
}

Operation.propTypes = {
  type: PropTypes.string,
  dealCode: PropTypes.string,
  brandCode: PropTypes.string,
  applicationCode: PropTypes.string
};

Operation.defaultProps = {
  type: '',
  dealCode: '',
  brandCode: '',
  applicationCode: ''
};
export default Operation;
