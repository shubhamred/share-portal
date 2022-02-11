import apiCall from 'app/sagas/api';
import apiCallV2 from 'app/sagas/v2';

export const getDocConfig = async (resource, queryParam) => {
  const url = `/configured-document-types/${resource}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    params: queryParam,
    url
  };
  return apiCall(apiArgs);
};

export const getDocConfigByProduct = async (resource, queryParam) => {
  const url = `/configured-document-types/${resource}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    params: queryParam,
    url
  };
  return apiCallV2(apiArgs);
};

export const getDocResource = async () => {
  const url = `/document-resources`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url
  };
  return apiCall(apiArgs);
};

/**
 * @description Get a list of all document types
 * @param params
 * @returns {Promise<null|*>}
 */
export async function getDocumentTypes(params) {
  const url = `/document-types`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function getConfiguredDocumentTypes(resource, categoryId) {
  const url = `/configured-document-types/${resource}/${categoryId}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export const updateConfiguredDocCategory = async (data) => {
  const url = `/configured-document-types/batch`;
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

export const archiveConfiguredDocCategory = async (configuredDocumentTypeId) => {
  const url = `/configured-document-types/${configuredDocumentTypeId}`;
  const apiArgs = {
    API_CALL: {
      method: 'DELETE'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
};

export const addDocCategories = async (data) => {
  const url = `/document-categories`;
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

export const updateDocCategory = async (documentCategoryId, data) => {
  const url = `/document-categories/${documentCategoryId}`;
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

export const addDocConfig = async (data) => {
  const url = `/configured-document-types`;
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

export const addDocType = async (data) => {
  const url = `/document-types`;
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

export const updateDocType = async (data, id) => {
  const url = `/document-types/${id}`;
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

export async function getDocumentCategories(params) {
  const url = `/document-categories`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function getDocumentTypeDetails(key) {
  const url = `/document-types/${key}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function getDocConfigSet(product) {
  const url = `/configured-document-types/${product}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCallV2(apiArgs);
}

export const updateConfiguration = async (id, data) => {
  const url = `/configured-document-types/id/${id}`;
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
