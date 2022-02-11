import apiCall from 'app/sagas/api';

/**
 * @description Get List of Products
 * @returns {Promise<null|*>}
 */
export const getProducts = () => {
  const url = `/products`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params: {
      take: 30
    },
    isLoaderRequired: true,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Get Details of single Product using id
 * @param id
 * @returns {Promise<null|*>}
 */
export const getSingleProducts = (id) => {
  const url = `/products/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Create New Product
 * @param data
 * @returns {Promise<null|*>}
 */
export const createNewProduct = (data) => {
  const url = `/products`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

/**
 * @description Update a Product Details
 * @param id
 * @param data
 * @returns {Promise<null|*>}
 */
export const updateProduct = (id, data) => {
  const url = `/products/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};
