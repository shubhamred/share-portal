import React, { useEffect, useState } from 'react';
import { Grid, IconButton } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useHistory } from 'react-router-dom';
import { DialogComponent, CustomeHeader } from 'app/components';

import { getProducts } from 'app/containers/products/saga';

import AddProduct from 'app/containers/products/productListing/components/addProduct';
import { formatCurrency } from 'app/utils/utils';
import style from './styles.scss';
import global from '../../global.scss';

const ProductListing = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [dialogOpen, toggleDialog] = useState(false);

  const toolbarActions = [{
    label: 'Add Product',
    onClick: () => toggleDialog(true)
  }];

  useEffect(() => {
    getProducts().then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
  }, []);

  const handleProductClick = (id) => {
    history.push(`/products/${id}`);
  };

  const handleModalClose = () => {
    toggleDialog(false);
    getProducts().then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
  };

  return (
    <Grid className={global.wrapper} direction="column">
      <CustomeHeader isFilter={false} isSearch={false} pageName="Klub  Products" actions={toolbarActions} />
      <Grid item={true} className={global.tableStyle}>
        <List>
          {
             products.length ? products.map((product) => (
               <ListItem className={style.listItemPadding} key={product.id}>
                 <Grid container={true}>
                   <Grid item={true} xs={12}>
                     {product.name}
                   </Grid>
                   <Grid item={true} xs={12} container={true}>
                     <Grid item={true} xs={4} className={style.listSubContainer}>
                       <p className={style.listItemKey}>Amount:</p>
                       <p className={style.listItemValue}>
                         { formatCurrency(product.minAmount)}
                         {' '}
                         to
                         {' '}
                         {formatCurrency(product.maxAmount)}
                       </p>
                     </Grid>
                     <Grid item={true} xs={4} className={style.listSubContainer}>
                       <p className={style.listItemKey}>Tenure:</p>
                       <p className={style.listItemValue}>
                         {product.minTenure}
                         {' '}
                         to
                         {' '}
                         {product.maxTenure}
                         {' '}
                         months
                         {' '}
                       </p>
                     </Grid>
                   </Grid>
                 </Grid>
                 <ListItemSecondaryAction>
                   <IconButton edge="end" aria-label="Visit" onClick={() => handleProductClick(product.id)}>
                     <ArrowForwardIosIcon />
                   </IconButton>
                 </ListItemSecondaryAction>
               </ListItem>
             )) : <p>No Products Available</p>
          }

        </List>
      </Grid>
      {
        dialogOpen && (
          <DialogComponent title="ADD Klub PRODUCT" onClose={handleModalClose}>
            <AddProduct onClose={handleModalClose} />
          </DialogComponent>
        )
      }
    </Grid>
  );
};

export default React.memo(ProductListing);
