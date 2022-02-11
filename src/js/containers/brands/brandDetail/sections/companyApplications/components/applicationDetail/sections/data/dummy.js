export const Bankdata = [
  {
    name: 'SBI',
    accountType: 'current Account',
    accountNumber: '321234324343',
    IFSC: 'SBI12334',
    isPrimary: true
  },
  {
    name: 'SBI',
    accountType: 'current Account',
    accountNumber: '321234324343',
    IFSC: 'SBI12334',
    isPrimary: false
  },
  {
    name: 'SBI',
    accountType: 'current Account',
    accountNumber: '321234324343',
    IFSC: 'SBI12334',
    isPrimary: false
  }
];

export const metaData = [
  {
    title: 'Payment Gateway',
    type: 'payment',
    data: [
      {
        name: 'Razorpay',
        mechantId: '321234324343',
        split: 10,
        isPrimary: true
      },
      {
        name: 'Cashfree',
        mechantId: '321234324343',
        split: 0,
        isPrimary: false
      }
    ]
  },
  {
    title: 'PoS',
    type: 'pos',
    data: [
      {
        name: 'Pinelabs',
        mechantId: '321234324343',
        split: 0,
        isPrimary: true
      }
    ]
  }
];
