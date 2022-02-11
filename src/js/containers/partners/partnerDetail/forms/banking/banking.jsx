import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { getCustomerBankDetails } from 'app/containers/patrons/saga';
import { DialogComponent, CustomeHeader } from '../../../../../components';
import BankDetail from './components/bankDetail';
import AddBankAccount from '../../../../patrons/patronDetail/sections/banking/addBankAccount';
import style from './styles.scss';
import global from '../../../../global.scss';

const Banking = (props) => {
  const { customer, isEntity } = props;
  const { companyCode } = customer || {};
  const [showListing, setBankListing] = useState(true);
  const [bankDetail, setBankDetail] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [banks, setBanks] = useState([]);
  const [isSponserAccount, handleSponser] = useState(false);

  const getBankData = () => {
    getCustomerBankDetails(companyCode).then((res) => {
      if (res.data && res.data.length) {
        setBanks(res.data);
        const filterSponser = res.data.find((bank) => bank.isPrimary);
        handleSponser(filterSponser?.isPrimary);
      }
    });
  };

  useEffect(() => {
    if (companyCode) {
      getBankData();
    }
  }, [companyCode]);

  const toolbarActions = [
    {
      label: (
        <div className={style.addWrapper}>
          <AddIcon className={style.editIcon} />
          <span>Create Bank</span>
        </div>
      ),
      onClick: () => setOpenDialog(true)
    }
  ];

  const handleBankClick = (bank) => {
    setBankListing(false);
    setBankDetail(bank);
  };

  return (
    <>
      {showListing ? (
        <Grid className={style.wrapper} direction="column">
          <Grid item={true} xs={12}>
            <CustomeHeader
              pageName=""
              actions={toolbarActions}
              isSearch={false}
              isFilter={false}
            />
          </Grid>
          <Grid item={true} className={global.tableStyle}>
            <List>
              {banks.length ? banks.map((bank) => (
                <ListItem className={style.listItemPadding} key={bank.id}>
                  <Grid container={true}>
                    <Grid item={true} container={true} xs={12}>
                      <Grid item={true} xs={4} md={4}>
                        <p className={style.listTitle}>Bank Name</p>
                      </Grid>
                      <Grid item={true} xs={4} md={6}>
                        <p className={style.listTitle}>Bank Account No</p>
                      </Grid>
                    </Grid>
                    <Grid item={true} container={true} xs={12}>
                      <Grid item={true} xs={4}>
                        <p className={style.listItemKey}>{bank?.bank?.name}</p>
                      </Grid>
                      <Grid item={true} xs={8}>
                        <p className={style.listItemKey}>{bank?.accountNumber}</p>
                      </Grid>
                    </Grid>
                  </Grid>
                  {bank?.isPrimary ? (
                    <Grid item={true} xs={2} md={2}>
                      <div className={style.sponserContainer}>
                        <p className={style.sponser}>{isEntity ? 'Primary Account' : 'Sponser Account'}</p>
                      </div>
                    </Grid>
                  ) : (
                    <Grid item={true} xs={2} md={2} />
                  )}
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="Visit" onClick={() => handleBankClick(bank)}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )) : (
                <p>No Bank Accounts Available</p>
              )}
            </List>
          </Grid>
        </Grid>
      ) : (
        <BankDetail
          bankDetail={bankDetail}
          isSponserAccount={isSponserAccount}
          isEntity={isEntity}
        />
      )}
      {openDialog ? (
        <DialogComponent
          title="Add Bank Account"
          closeButton={true}
          onClose={() => setOpenDialog(false)}
        >
          <AddBankAccount
            patronCode={companyCode}
            onClose={(val) => {
              setOpenDialog(false);
              if (val) getBankData();
            }}
          />
        </DialogComponent>
      ) : null}
    </>
  );
};

Banking.propTypes = {
  customer: PropTypes.shape({})
};

Banking.defaultProps = {
  customer: {}
};

export default Banking;
