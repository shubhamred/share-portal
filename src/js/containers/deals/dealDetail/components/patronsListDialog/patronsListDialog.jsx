/* eslint-disable array-callback-return */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core';
import * as StyledButton from '@material-ui/core';
import UploadButton from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button, Input } from 'app/components';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import styles from './styles.scss';
import { getPatrons } from '../../../../patrons/saga';
import { getDealPatronsList, uploadPatronCSV } from '../../../saga';

const PatronsListDialog = (props) => {
  const { onSubmit, deal, togglePatronsListForm } = props;
  const dispatch = useDispatch();
  const hiddenFileInput = React.useRef(null);
  const { name, dealCode } = deal || {};
  const [searchPatronText, setSearchPatronText] = useState('');
  const [searchSelectedPatronText, setSearchSelectedPatronText] = useState('');
  const [selectedPatronList, setSelectedPatronList] = useState([]);
  const [unselectedPatronList, setUnselectedPatronList] = useState([]);
  const [patronCodeList, setPatronCodeList] = useState([]);

  const [selctedList1, setSelctedList1] = useState([]);
  const [selctedList2, setSelctedList2] = useState([]);
  const [selctedList3, setSelctedList3] = useState([]);
  const [dummySelectionsPage, setDummySelectionsPage] = useState({ index: 1, count: 0, total: 1 });
  const [dummySelectionsPageSelected, setDummySelectionsPageSelected] = useState({ index: 1, count: 0, total: 1 });

  const handleUnselectedOptionChange = (patronData, status) => {
    const mSelctedList1 = [...selctedList1];
    const mDataUnSelected = [...unselectedPatronList];
    const getIndex = mDataUnSelected.findIndex((list) => list.id === patronData.id);
    if (getIndex > -1) {
      mDataUnSelected[getIndex].isSelected = status;
      if (status) {
        mSelctedList1.push({ ...patronData, isSelected: true });
      } else {
        const ind = mSelctedList1.findIndex((list) => list.id === patronData.id);
        mSelctedList1.splice(ind, 1);
      }
      setUnselectedPatronList(mDataUnSelected);
      setSelctedList1(mSelctedList1);
    }
  };

  const handleSelectedOptionChange = (patronData, status) => {
    const mSelctedList2 = [...selctedList2];
    const mDataSelected3 = [...selctedList3];
    const mDataSelected = [...selectedPatronList];
    const getIndex = mDataSelected.findIndex((list) => list.id === patronData.id);
    if (getIndex > -1) {
      mDataSelected[getIndex].isSelected = status;
      if (status) {
        const x = mDataSelected3.findIndex((list) => list.id === patronData.id);
        mDataSelected3.splice(x, 1);
        mSelctedList2.push({ ...patronData, isSelected: true });
      } else {
        const ind = mSelctedList2.findIndex((list) => list.id === patronData.id);
        mDataSelected3.push(mSelctedList2[ind]);
        mSelctedList2.splice(ind, 1);
      }
      setSelectedPatronList(mDataSelected);
      setSelctedList2(mSelctedList2);
      setSelctedList3(mDataSelected3);
    }
  };

  const handleFormSubmit = () => {
    const userList = [];
    selctedList1.map((list) => {
      userList.push(list.patronCode);
    });
    selctedList2.map((list) => {
      userList.push(list.patronCode);
    });
    onSubmit({
      selectedPatronCodes: userList,
      dealCode: deal.dealCode
    });
  };

  const getLinkedPatron = async () => {
    if (dummySelectionsPage.total > dummySelectionsPage.count) {
      const patronParams = {
        fields: 'patronCode',
        where: {
          dealCode: deal.dealCode
        },
        take: 50,
        page: dummySelectionsPage.index
      };
      await getDealPatronsList(patronParams).then((data) => {
        if (data?.meta?.total > dummySelectionsPage.count) {
          const pList = [];
          if (data.data) {
            data.data.map((list) => {
              pList.push(list.patronCode);
            });
          }
          setPatronCodeList([...patronCodeList, ...pList]);
          setDummySelectionsPage({ index: dummySelectionsPage.index + 1, count: dummySelectionsPage.count + data.meta.length, total: data.meta.total });
        }
      }).catch(() => {

      });
    } else {
      getUnselectedPatronList(patronCodeList);
      getSelectedPatronList(patronCodeList);
    }
  };

  const fetchPatronList = async () => {
    const patronParams = {
      fields: 'patronCode',
      where: {
        dealCode: deal.dealCode
      },
      take: 100
    };
    await getDealPatronsList(patronParams).then((data) => {
      const pList = [];
      if (data.data) {
        data.data.map((list) => {
          pList.push(list.patronCode);
        });
      }
      setPatronCodeList(pList);
      getUnselectedPatronList(pList);
      getSelectedPatronList(pList);
    });
    return 1;
  };

  useEffect(() => {
    getLinkedPatron();
  }, [dummySelectionsPage]);

  useEffect(() => {
    fetchPatronList();
  }, []);

  const getUnselectedPatronList = (list = patronCodeList, search = searchPatronText, listes = selctedList1) => {
    const customerParams1 = {
      fields: 'name,firstName,lastName,id,email,patronCode',
      where: {
        // isPatron: true
      },
      take: 100,
      page: 1
    };
    if (list.length > 0) {
      customerParams1.where.patronCode = {
        nin: list
      };
    }
    if (search !== '') {
      customerParams1.where.email = { keyword: search };
    }
    getPatrons(customerParams1).then((cusData) => {
      const idArray = [];
      listes.map((ll) => {
        idArray.push(ll.id);
      });
      const mData = [];
      cusData.data.map((lst) => {
        if (!idArray.includes(lst.id)) {
          mData.push({ ...lst, isSelected: false });
        }
      });
      setUnselectedPatronList([...listes, ...mData]);
    });
  };

  useEffect(() => {
    getSelectedPatronList(patronCodeList);
  }, [dummySelectionsPageSelected]);

  const getSelectedPatronList = (list = patronCodeList, search = searchSelectedPatronText) => {
    if (list.length > 0 && (dummySelectionsPageSelected.total > dummySelectionsPageSelected.count)) {
      const customerParams2 = {
        fields: 'name,firstName,lastName,id,email,patronCode',
        where: {
          patronCode: {
            in: list
          }
          // isPatron: true
        },
        take: 100,
        page: dummySelectionsPageSelected.index
      };
      if (search !== '') {
        customerParams2.where.email = { keyword: search };
      }
      getPatrons(customerParams2).then((cusData) => {
        const mData = [...selectedPatronList];
        const mData1 = [...selctedList2];
        cusData.data.map((lst) => {
          mData1.push(lst);
          mData.push({ ...lst, isSelected: true });
        });
        setSelectedPatronList([...mData]);
        setSelctedList2(mData1);
        setDummySelectionsPageSelected({ index: dummySelectionsPageSelected.index + 1, count: dummySelectionsPageSelected.count + cusData.meta.length, total: cusData.meta.total });
      });
    }
  };

  const debounceHandleChange1 = useCallback(
    debounce((list, val, listes) => getUnselectedPatronList(list, val, listes), 500),
    []
  );

  const debounceHandleChange2 = useCallback(
    debounce((key) => filterSelectedPatron(key), 500),
    []
  );

  const getSearchResult = (patron = {}, searchText) => patron.name?.toLowerCase().includes(searchText.toLowerCase())
  || patron.email?.toLowerCase().includes(searchText.toLowerCase())
  || patron.patronCode?.toLowerCase().includes(searchText.toLowerCase());

  const filterSelectedPatron = (key = searchSelectedPatronText) => {
    if (key !== '') {
      return selectedPatronList.filter((list) => getSearchResult(list, key));
    }
    return selectedPatronList;
  };

  const handleFileUpload = () => {
    hiddenFileInput.current.click();
  };

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleFileChange = async (e) => {
    const mData = await getBase64(e.target.files[0]);
    if (mData) {
      const response = await uploadPatronCSV({ file: mData, dealCode });

      const { failedPatronCodesCount, addedPatronCodesCount } = response?.data?.[dealCode] || {};
      const invalidPatrons = response?.invalidData || [];
      const totalPatrons = invalidPatrons?.length + failedPatronCodesCount + addedPatronCodesCount;

      if (addedPatronCodesCount) {
        dispatch({
          type: 'show',
          payload: `${addedPatronCodesCount}/${totalPatrons} ${addedPatronCodesCount === 1 ? 'patron' : 'patrons'} successfully uploaded`,
          msgType: 'success'
        });
        await fetchPatronList(); // fetch updated patron list
        resetState();
      }
      if (failedPatronCodesCount > 0) {
        dispatch({
          type: 'show',
          payload: `${failedPatronCodesCount}/${totalPatrons} Patron upload failed`,
          msgType: 'error'
        });
      }
      if (invalidPatrons?.length > 0) {
        dispatch({
          type: 'show',
          payload: `${invalidPatrons?.length}/${totalPatrons} invalid data`,
          msgType: 'error'
        });
      }
    }
  };

  const resetState = () => {
    setSelectedPatronList([]);
    setUnselectedPatronList([]);
    setPatronCodeList([]);
    setSelctedList1([]);
    setSelctedList3([]);
    setDummySelectionsPage({ index: 1, count: 0, total: 1 });
    setDummySelectionsPageSelected({ index: 1, count: 0, total: 1 });
  };

  return (
    <Grid
      className={styles.contentWrapper}
      item={true}
      direction="row"
      container={true}
    >
      <Grid container={true} item={true} direction="row">
        <Grid item={true} xs={6}>
          <p className={styles.dealDetail}>
            <span>{name || ''}</span>
            Configure patron access to Private investments
          </p>
        </Grid>
        <Grid item={true} xs={6} className={styles.buttonSide}>
          <input
            type="file"
            accept=".csv"
            ref={hiddenFileInput}
            onChange={handleFileChange}
            className={styles.hideFile}
          />
          <UploadButton
            color="default"
            startIcon={<CloudUploadIcon className={styles.uploadBtnIcon} />}
            onClick={handleFileUpload}
            className={styles.uploadBtn}
          >
            Upload Patrons
          </UploadButton>
          {/* <Button type="button" label="Upload Patrons" onClick={handleFileUpload} /> */}
        </Grid>
      </Grid>
      <form className={styles.form}>
        <Grid container={true} item={true} direction="row">
          <Grid item={true} xs={6}>
            <p className={styles.dealHeaderHeading}>Select Patrons</p>
            <Input
              id="searchInput1"
              underLineDisable={false}
              placeholder="Search"
              isFieldValue={false}
              propValue={searchPatronText}
              onValueChange={(value) => {
                setSearchPatronText(value);
                debounceHandleChange1(patronCodeList, value, selctedList1);
              }}
              searchButton={true}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <p className={styles.dealHeaderHeading}>
              Selected Patrons
              <span className={styles.patronCount}>{selectedPatronList?.length || ''}</span>
            </p>
            <Input
              id="searchInput2"
              underLineDisable={false}
              placeholder="Search"
              isFieldValue={false}
              propValue={searchSelectedPatronText}
              onValueChange={(value) => {
                setSearchSelectedPatronText(value);
                debounceHandleChange2(value);
              }}
              searchButton={true}
            />
          </Grid>
        </Grid>
        <Grid container={true} item={true} direction="row" className={styles.mainDetailsList}>
          <div className={styles.gridList}>
            <Grid item={true} xs={11} className={styles.mainDetailsListDiv}>
              {unselectedPatronList.map((list, ind) => (
                <Grid
                  key={`unselected-${list.email}`}
                  container={true}
                  item={true}
                  direction="row"
                  className={styles.mainDetailsWrapper}
                >
                  <Grid className={styles.mainDetailsName} item={true} xs={4}>
                    {list.name}
                  </Grid>
                  <Grid className={styles.mainDetailsEmail} item={true} xs={6}>
                    {list.email}
                  </Grid>
                  <Grid item={true} xs={2} justify="center" style={{ textAlign: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={false}
                          checked={list.isSelected}
                          onChange={({ target }) => handleUnselectedOptionChange(list, target.checked)}
                          name={`patron-unselected-${ind}`}
                          color="primary"
                        />
                      }
                      label=""
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item={true} xs={11} className={styles.mainDetailsListDiv}>
              {filterSelectedPatron().map((list, ind) => (
                <Grid
                  key={`selected-${list.email}`}
                  container={true}
                  item={true}
                  direction="row"
                  className={styles.mainDetailsWrapper}
                >
                  <Grid className={styles.mainDetailsName} item={true} xs={4}>
                    {list.name}
                  </Grid>
                  <Grid className={styles.mainDetailsEmail} item={true} xs={6}>
                    {list.email}
                  </Grid>
                  <Grid item={true} xs={2} justify="center" style={{ textAlign: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={false}
                          checked={list.isSelected}
                          onChange={({ target }) => handleSelectedOptionChange(list, target.checked)}
                          name={`patron-selected-${ind}`}
                          color="primary"
                        />
                    }
                      label=""
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </div>
        </Grid>
        <Grid container={true} item={true} direction="row" alignItems="center" justify="flex-end">
          <StyledButton.Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              togglePatronsListForm();
            }}
            type="button"
          >
            Cancel
          </StyledButton.Button>
          <Button type="button" label="Submit" onClick={() => handleFormSubmit()} />
        </Grid>
      </form>
    </Grid>
  );
};

PatronsListDialog.propTypes = {
  onSubmit: PropTypes.func
};

PatronsListDialog.defaultProps = {
  onSubmit: () => {}
};

export default PatronsListDialog;
