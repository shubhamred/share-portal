const FilterTypes = {
  TAB: 'TAB',
  DRAWER: 'DRAWER'
};

const FilterInputTypes = {
  MultiSelect: 1,
  SingleSelect: 2,
  DateRange: 3,
  AutoComplete: 4
};

export default FilterTypes;

const FilterData = [
  {
    name: 'Party Name',
    value: [
      {
        label: 'Razorpay',
        value: 'Razorpay'
      },
      {
        label: 'PayU',
        value: 'PayU'
      },
      {
        label: 'NEFT',
        value: 'NEFT'
      }
    ],
    type: FilterInputTypes.MultiSelect,
    isSearchable: true,
    key: 'partyName' // key to make api payload
  },
  {
    name: 'Transaction type',
    value: [
      {
        label: 'Credit',
        value: 'Credit'
      },
      {
        label: 'Debit',
        value: 'Debit'
      }
    ],
    type: FilterInputTypes.MultiSelect,
    isSearchable: true,
    key: 'transactionType', // key to make api payload
    selectedValue: {
      search: '',
      value: []
    }
  },
  {
    name: 'Tag',
    value: [
      {
        label: 'No Tag',
        value: 'No tag'
      },
      {
        label: 'Razorpay',
        value: 'Razorpay'
      },
      {
        label: 'Cashfree',
        value: 'Cashfree'
      }
    ],
    type: FilterInputTypes.MultiSelect,
    isSearchable: true,
    key: 'tag', // key to make api payload,
    selectedValue: {
      search: '',
      value: []
    }
  },
  {
    name: 'Date',
    value: [],
    type: FilterInputTypes.DateRange,
    isSearchable: false,
    key: 'date', // key to make api payload
    selectedValue: {
      search: '',
      value: []
    }
  }
];

export { FilterData, FilterInputTypes };
