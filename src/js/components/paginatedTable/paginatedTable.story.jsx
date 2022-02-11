import React from 'react';
import { storiesOf } from '@storybook/react';
import PaginatedTable from './paginatedTable';

storiesOf('PaginatedTable', module)
  .add('PaginatedTable-default', () => {
    const rowData = [
      {
        bizName: 'Klub',
        applicantName: 'gautam',
        applicantMobile: '9004235816',
        amount: '50,00,000',
        appliedDate: '15/12/19'
      },
      {
        bizName: 'Kilub',
        applicantName: 'gautam',
        applicantMobile: '9004235816',
        amount: '50,00,000',
        appliedDate: '15/12/19'
      },
      {
        bizName: 'Kluib',
        applicantName: 'gautam',
        applicantMobile: '9004235816',
        amount: '50,00,000',
        appliedDate: '15/12/19'
      },
      {
        bizName: 'Kliub',
        applicantName: 'gautam',
        applicantMobile: '9004235816',
        amount: '50,00,000',
        appliedDate: '15/12/19'
      }
    ];
    const rowNames = ['bizName', 'applicantName', 'applicantMobile', 'amount', 'appliedDate'];
    const columns = ['Business Name', 'Applicant Name', 'Applicant Mobile', 'Funding Amount', 'Applied on'];
    return (
      <div>
        <PaginatedTable rowNames={rowNames} columns={columns} rowData={rowData} rowsPerPage={3} page={0} />
      </div>
    );
  });
