import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs } from 'app/components';
import { useParams } from 'react-router-dom';
import { getSingleProducts } from 'app/containers/products/saga';
import DocumentsTab from './sections/documents';
import ProductOverview from './sections/overview';

import style from './styles.scss';

// eslint-disable-next-line no-unused-vars
const ProductDetail = (props) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getSingleProducts(productId).then((res) => {
      setProduct(res.data);
    });
  };

  const tabList = [
    {
      label: 'Overview',
      content: <ProductOverview id={productId} product={product} productUpdated={fetchData} />
    },
    {
      label: 'REQ. DOCUMENTS',
      content: <DocumentsTab productId={productId} product={product} />
    }
  ];

  return (
    <>
      <Grid container={true} className={style.mainContainer}>
        <Grid item={true}>
          <p className={style.productHeading}>{product?.name}</p>
        </Grid>
        <Grid item={true} xs={12}>
          <Tabs tabList={tabList} />
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(ProductDetail);
