import React from 'react';
import { storiesOf } from '@storybook/react';
import DocumentElement from './documentElement';

storiesOf('DocumentElement', module)
  .add('default DocumentElement', () => {
    const docCategory = 'KYC';
    const status = 'Verified';
    const docTypes = ['Address Proof', 'Tax slip', 'PAN'];
    const statusOptions = ['Verified', 'Pending', 'Archived'];
    const selectedStatusOption = 'Verified';
    const uploaded = true;
    const uploadedDocs = [{
      category: 'KYC', type: 'PAN', name: 'abc.pdf', url: 'www.google.com'
    }, {
      category: 'KYC', type: 'PAN', name: 'abc.pdf', url: 'www.google.com'
    }];
    const selectedDocumentType = 'Address Proof';
    return (
      <DocumentElement
        docCategory={docCategory}
        status={status}
        docTypes={docTypes}
        selectedDocumentType={selectedDocumentType}
        statusOptions={statusOptions}
        selectedStatusOption={selectedStatusOption}
        uploaded={uploaded}
        uploadedDocs={uploadedDocs}
      />
    );
  });
