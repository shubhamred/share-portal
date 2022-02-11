import apiCall from 'app/sagas/api';
import { isArray } from 'lodash';

/**
 * @description Get all applications list
 * @param limit
 * @param offset
 * @param query
 * @returns {Promise<null|*>}
 */
export async function getApplications(limit, offset, query) {
  const url = `/applications`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: limit,
      page: offset,
      includes: ['product'],
      order: { createdAt: 'DESC' },
      ...query
    },
    isLoaderRequired: true,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export function getApplicationDetail(id) {
  const url = `/applications/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      includes: ['product']
    },
    isLoaderRequired: true,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export function updateApplicationDetail(id, data) {
  const url = `/applications/${id}`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function getApplicationsOfBrand(companyId) {
  const url = `/applications`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    isLoaderRequired: true,
    params: {
      take: 50,
      where: { companyId },
      includes: ['product'],
      order: { createdAt: 'ASC' }
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function postNewApplication(data) {
  const url = `/applications`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get document categories using document resource
 * @param resourceType
 * @returns {Promise<null|*>}
 */
export async function getDocumentCategories(limit = 50) {
  const url = `/document-categories`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: limit
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Create a new configured document type
 * @param data
 * @returns {Promise<null|*>}
 */
export async function postNewDocType(data) {
  const url = `/configured-document-types/bulk`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data,
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get a list of all document types
 * @returns {Promise<null|*>}
 */
export async function getDocumentTypes(limit = 50) {
  const url = `/document-types`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    params: {
      take: limit
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

/**
 * @description Get document config (categories and document types) using resource and resource code
 * @param {string} resource
 * @param {string} resourceCode
 * @returns {Promise<null|*>}
 */
export async function getAdditionalDocConfig(
  // eslint-disable-next-line no-unused-vars
  resource = 'APPLICATION',
  resourceCode
) {
  const url = `/configured-document-types/${resourceCode}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function saveFile(action) {
  const isMultipleFiles = isArray(action);
  let files;
  if (isMultipleFiles) {
    files = action.map((data) => ({
      key: data.key,
      fileName: data.name,
      contentType: data.type,
      size: data.size,
      document: {
        resourceCategory: data.resourceType,
        resourceId: data.resourceId,
        docCategory: data.docCategory,
        docType: data.docType
      }
    }));
  } else {
    files = [
      {
        key: action.key,
        fileName: action.name,
        contentType: action.type,
        size: action.size,
        document: {
          resourceCategory: action.resourceType,
          resourceId: action.resourceId,
          docCategory: action.docCategory,
          docType: action.docType
        }
      }
    ];
  }

  const url = `/files/batch`;
  const apiArgs = {
    API_CALL: {
      method: 'POST'
    },
    data: { files },
    url,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export async function getBanks(params) {
  const url = `/banks`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url,
    params,
    TYPES: {}
  };
  return apiCall(apiArgs);
}

export function getConfig(resourceType) {
  const url = `/configured-document-types/${resourceType}`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url
  };
  return apiCall(apiArgs);
}

/**
 * @description Portal: (Sanction/Update Sanction data) an existing application by id
 * @param applicationId
 * @param payload
 * @returns {Promise<null|any>}
 */
export const updateSanctionedAmount = (applicationId, payload) => {
  const url = `/applications/${applicationId}/sanction`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    url,
    data: payload
  };
  return apiCall(apiArgs);
};

/**
 * @description Get application status graph
 * @returns {Promise<null|*>}
 */
export const getApplicationStatus = (applicationId) => {
  const url = `/applications/${applicationId}/status-graph`;
  const apiArgs = {
    API_CALL: {
      method: 'GET'
    },
    url
  };
  return apiCall(apiArgs);
};

/**
 * @description Update an application status by id
 * @param applicationId
 * @param payload
 * @returns {Promise<null|*>}
 */
export const updateApplicationStatus = (applicationId, payload) => {
  const url = `/applications/${applicationId}/status`;
  const apiArgs = {
    API_CALL: {
      method: 'PUT'
    },
    url,
    data: payload
  };
  return apiCall(apiArgs);
};
