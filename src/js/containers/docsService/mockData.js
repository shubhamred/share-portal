export const mockData = {
  message: 'OK',
  meta: {
    length: 1,
    took: 1,
    total: 1
  },
  data: [
    {
      id: '7c688fff-b7bc-419d-8ded-0c9e256150ad',
      createdAt: '2020-02-14T12:02:51.280Z',
      updatedAt: '2020-02-14T12:02:51.280Z',
      key: 'GST_RETURNS',
      documentConfigId: null,
      name: 'Dummy GST Returns',
      isMandatory: false,
      noOfDocTypesRequired: 2,
      displayOrder: 3,
      configuredDocTypes: [
        {
          id: 'f39eaf59-41fe-4af0-99e0-dfa569139017',
          createdAt: '2020-10-28T15:58:53.414Z',
          updatedAt: '2020-10-28T15:58:53.414Z',
          resource: 'PRODUCT',
          resourceCode: 'PRD-GRO',
          documentType: {
            id: '5e0b55f7-04a4-49a1-b65b-4b6978cb7fb3',
            createdAt: '2020-10-28T15:58:53.414Z',
            updatedAt: '2020-10-28T15:58:53.414Z',
            key: 'GST',
            name: 'GST Returns',
            maximumFiles: 25,
            maximumFileSize: 26214400,
            allowedContentTypes: ['application/pdf', 'image/png', 'image/jpeg'],
            storageTemplate: null,
            addDateFolder: false,
            status: 'Active',
            isArchived: false,
            createdBy: null,
            updatedBy: null
          },
          isMandatory: true,
          displayOrder: 1,
          status: 'Active',
          isArchived: false,
          createdBy: null,
          updatedBy: null
        }
      ],
      status: 'Active',
      isArchived: false,
      createdBy: null,
      updatedBy: null
    }
  ]
};

export const fileTypeData = [
  {
    groupName: 'image',
    list: ['image/png', 'image/jpeg', 'image/jpg']
  },
  {
    groupName: 'pdf',
    list: ['application/pdf']
  },
  {
    groupName: 'doc',
    list: ['.docx', '.doc']
  },
  {
    groupName: 'csv',
    list: ['.csv']
  },
  {
    groupName: 'excel',
    list: ['.xls', '.xlsx', '.xlt', '.xla', '.xlsm', '.xltm', '.xlam', '.xlsb']
  },
  {
    groupName: 'ppt',
    list: ['.ppt']
  },
  {
    groupName: 'zip',
    list: ['.zip']
  }
];

export const templateFileType = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  '.docx',
  '.doc',
  '.xls',
  '.xlsx',
  '.xlt',
  '.xla',
  '.xlsm',
  '.xltm',
  '.xlam',
  '.xlsb'
];
