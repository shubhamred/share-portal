const DocStatuses = {
  GENERATED: 'Doc generated',
  SIGN_LINK_CREATED: 'Signing link created',
  SIGN_DONE: 'Signing done'
};

const DocType = {
  DebentureSubscription: 'DEBENTURE_SUBSCRIPTION',
  MoneteryAndCollection: 'MONETARY_COLLECTION',
  DeedOfHypothication: 'DEED_OF_HYPOTHECATION',
  WavierLetter: 'WavierLetter',
  DebentureTrustDeed: 'DEBENTURE_TRUST_DEED',
  DebentureTrusteeAgreement: 'DEBENTURE_TRUSTEE_AGREEMENT',
  PaymentGateway: 'PaymentGateway',
  COD: 'COD',
  Marketplace: 'Marketplace',
  POS: 'POS',
  POSWithPaymentGateway: 'POSWithPaymentGateway'
};

const Tabs = {
  Details: 'Details',
  Wavier: 'Wavier',
  BrandFounder: 'Brand founder',
  BrandDirectors: 'Brand Directors',
  ImportantDates: 'Important Dates',
  Brand: 'Brand Details',
  Founder: 'Founder',
  Deal: 'Deal Details',
  PgPos: 'PG & POS',
  Pg: 'PG',
  RevenueShare: 'Revenue Share',
  Pos: 'POS',
  COD: 'COD',
  Marketplace: 'Marketplace',
  Banking: 'Banking',
  Patron: 'Patron Details',
  Director: 'Director Details',
  SHARE_HOLIDING: 'Share holding pattern',
  HypothecatedProperty: 'Hypothecated Property',
  RevenueShareTable: 'Revenue share (table)'
};

const DealInvestmentStatus = {
  SOUGHT: 'Sought',
  INTERESTED: 'Interested',
  NOT_INTERESTED: 'Not Interested',
  DECLINED: 'Declined',
  APPROVED: 'Approved',
  DOC_INITIATED: 'Doc Initiated',
  DOC_SIGNED: 'Doc Signed',
  DROPPED: 'Dropped',
  PULLED: 'Pulled',
  INVESTED: 'Invested',
  REPAYING: 'Repaying',
  DELAYED: 'Delayed',
  DEFAULTED: 'Defaulted',
  FULLY_REPAID: 'Fully Repaid'
};

const docList = [
  {
    id: 1,
    type: DocType.DebentureSubscription,
    name: 'Debenture Subscription',
    lastUpdatedAt: new Date(),
    status: DocStatuses.GENERATED
  },
  {
    id: 2,
    type: DocType.MoneteryAndCollection,
    name: 'Monetery and Collection',
    lastUpdatedAt: new Date(),
    status: DocStatuses.SIGN_LINK_CREATED
  },
  {
    id: 3,
    type: DocType.DeedOfHypothication,
    name: 'Deed of Hypothication',
    lastUpdatedAt: new Date(),
    status: DocStatuses.SIGN_DONE
  },
  // {
  //   id: 4,
  //   type: DocType.WavierLetter,
  //   name: 'Wavier Letter',
  //   lastUpdatedAt: new Date(),
  //   status: DocStatuses.SIGN_DONE
  // },
  {
    id: 5,
    type: DocType.DebentureTrustDeed,
    name: 'Debenture Trust Deed',
    lastUpdatedAt: new Date(),
    status: DocStatuses.SIGN_DONE
  },
  {
    id: 6,
    type: DocType.DebentureTrusteeAgreement,
    name: 'Debenture Trustee Agreement',
    lastUpdatedAt: new Date(),
    status: DocStatuses.SIGN_DONE
  }
];

export default docList;

const dummyTableData = {
  data: [
    {
      name: 'Lakshman',
      email: 'ravi@gmail.com',
      address: 'HSR Layout, Bangalore - 56...',
      pan: 'ABCDE1234D',
      debentures: 120
    },
    {
      name: 'Sita',
      email: 'ravi@gmail.com',
      address: 'HSR Layout, Bangalore - 56...',
      pan: 'ABCDE1234D',
      debentures: 300
    }
  ],
  meta: {
    total: 1
  }
};

/*
For Input
[key name]: {
  label: 'lable name',
  value: '-',
  type: 'input'
}

For Switch
[key name]: {
  label: 'lable name',
  value: false,
  type: 'switch'
}

For Select
[key name]: {
  label: 'lable name',
  value: '-',
  type: 'select',
  options: [
    {
      label: 'lable name',
      value: 'value'
    }
  ]
}
*/

const DialogData = {
  [DocType.DebentureSubscription]: {
    tabList: [
      {
        tabName: Tabs.Brand,
        formData: {
          brand_legal_name: {
            label: 'Brand legal name',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_reg_address: {
            label: 'Reg Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Patron,
        contentType: 'Accordion',
        formData: {
          patron_name: {
            label: 'Patron Name',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_permanent_address: {
            label: 'Permanent Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_invested_amount: {
            label: 'Invested amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_no_of_deb_issued: {
            label: 'No. of debentures issued',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Director,
        contentType: 'Accordion',
        formData: {
          director_name: {
            label: 'Director Name',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_email: {
            label: 'Email',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_mobile: {
            label: 'Mobile',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_permanent_address: {
            label: 'Director Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          is_authorized_signatory: {
            label: 'Authorized Signatory',
            value: false,
            type: 'switch',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.SHARE_HOLIDING,
        contentType: 'table',
        formData: {}
      },
      {
        tabName: Tabs.Deal,
        formData: {
          deal_total_amount: {
            label: 'Total deal Amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_total_no_of_deb: {
            label: 'Total no. of Debentures',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_purpose_of_fundraise: {
            label: 'Purpose of fundraise',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_deb_series: {
            label: 'Debenture series',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.RevenueShare,
        formData: {
          deal_fixed_yield_of_deb: {
            label: 'Fixed yield of Debenture',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_total_revenue_share: {
            label: 'Total Revenue Share',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_repayment_of_the_principle: {
            label: 'Repayment of the principle',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_repayment_of_interest: {
            label: 'Repayment of Interest',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_hyp_assets_detail_valuation_report: {
            label: 'Hypothecated assets details as per valuation report',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: 'Thresold Details',
        formData: {
          soft_threshold_amount: {
            label: 'Soft threshold amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          hard_threshold_amount: {
            label: 'Hard threshold amount',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Pg,
        contentType: 'Accordion',
        formData: {
          pg_account_type: {
            label: 'PG account type',
            value: '-',
            type: 'input'
          },
          pg_account_name: {
            label: 'PG account name',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_number: {
            label: 'PG account number',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_contribution: {
            label: 'Min Contribution(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_split: {
            label: 'Split Percentage(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          primary_pg: {
            label: 'Primary',
            value: false,
            type: 'switch',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Pos,
        contentType: 'Accordion',
        formData: {
          pos_account_type: {
            label: 'PoS account type',
            value: '-',
            type: 'input'
          },
          pos_acc_name: {
            label: 'PoS account name',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_acc_number: {
            label: 'PoS account number',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_account_contribution: {
            label: 'Min Contribution(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_account_split: {
            label: 'Split Percentage(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          primary_pos: {
            label: 'Primary',
            value: false,
            type: 'switch',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Banking,
        contentType: 'Accordion',
        formData: {
          BA_holder_name: {
            label: 'Account holder name',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_number: {
            label: 'Account number',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_name: {
            label: 'Bank name',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_branch_city: {
            label: 'Branch & City',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_ifsc: {
            label: 'IFSC code',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_Type: {
            label: 'Account type',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_primary_revenue_bank: {
            label: 'Primary Revenue Bank (Y/N)',
            value: false,
            type: 'switch'
          },
          BA_investment_account: {
            label: 'Capital /Investment Account (Y/N)',
            value: false,
            type: 'switch'
          }
        }
      },
      {
        tabName: 'Disclosure',
        formData: {
          disclousere_schedule: {
            label: 'Disclosure Schedule',
            value: '-',
            type: 'richTextBox',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.RevenueShareTable,
        contentType: 'table',
        formData: {}
      },
      {
        tabName: 'Cap Revenue Details',
        formData: {
          baseRevenueAmount: {
            label: 'Base Revenue amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          lowerCapRevenuePercentage: {
            label: 'Floor Percentage %',
            value: '-',
            type: 'input',
            disabled: true
          },
          upperCapRevenuePercentage: {
            label: 'Cap Percentage %',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      }
    ],
    api: 'test'
  },
  [DocType.MoneteryAndCollection]: {
    tabList: [
      {
        tabName: Tabs.Brand,
        formData: {
          brand_legal_name: {
            label: 'Brand legal name',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Deal,
        formData: {
          deal_total_amount: {
            label: 'Deal Value',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_purpose_of_investment: {
            label: 'Purpose of Invesmtnnt',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_fixed_yield_of_deb: {
            label: 'Fixed yield of Debenture',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_total_revenue_share: {
            label: 'Total Revenue Share',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_repayment_of_principles: {
            label: 'Repayment of the principle',
            value: '-',
            type: 'input',
            disabled: true
          },
          deal_repayment_of_interest: {
            label: 'Repayment of Interest',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Pg,
        contentType: 'Accordion',
        formData: {
          pg_account_type: {
            label: 'PG account type',
            value: '-',
            type: 'input'
          },
          pg_account_name: {
            label: 'PG account name',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_number: {
            label: 'PG account number',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_contribution: {
            label: 'Min Contribution(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          pg_account_split: {
            label: 'Split Percentage(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          primary_pg: {
            label: 'Primary',
            value: false,
            type: 'switch',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Pos,
        contentType: 'Accordion',
        formData: {
          pos_account_type: {
            label: 'PoS account type',
            value: '-',
            type: 'input'
          },
          pos_acc_name: {
            label: 'PoS account name',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_acc_number: {
            label: 'PoS account number',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_account_contribution: {
            label: 'Min Contribution(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          pos_account_split: {
            label: 'Split Percentage(%)',
            value: '-',
            type: 'input',
            disabled: true
          },
          primary_pos: {
            label: 'Primary',
            value: false,
            type: 'switch',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Banking,
        contentType: 'Accordion',
        formData: {
          BA_number: {
            label: 'Account Number',
            value: '-',
            type: 'input',
            disabled: true
          },
          BA_name: {
            label: 'Bank Name',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Patron,
        contentType: 'Accordion',
        formData: {
          patron_name: {
            label: 'Name of Patron',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_email: {
            label: 'Email',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_permanent_address: {
            label: 'Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_invested_amount: {
            label: 'Investment amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_no_of_deb_issued: {
            label: 'No. of Series A Debentures issued',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_fee: {
            label: 'Patron Fee',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      }
    ]
  },
  [DocType.DeedOfHypothication]: {
    tabList: [
      {
        tabName: Tabs.Details,
        formData: {
          hypothication_date: {
            label: 'Hypothecation Date',
            value: '-',
            type: 'input',
            disabled: true
          },
          hypothicated_property: {
            label: 'Hypothecated Property',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Brand,
        formData: {
          brand_legal_name: {
            label: 'Brand legal name',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_cin: {
            label: 'Brand CIN',
            value: '-',
            type: 'input',
            disabled: true
          },
          registered_address: {
            label: 'Registered Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          description: {
            label: 'Brand description',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Deal,
        formData: {
          no_of_deb: {
            label: 'No. of debentures',
            value: '-',
            type: 'input',
            disabled: true
          },
          total_amount: {
            label: 'Total Amount',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Director,
        contentType: 'Accordion',
        formData: {
          director_name: {
            label: 'Director Name',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_email: {
            label: 'Email',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_mobile: {
            label: 'Mobile',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_permanent_address: {
            label: 'Director Address',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      }
    ]
  },
  [DocType.WavierLetter]: {
    tabList: [
      {
        tabName: Tabs.Wavier,
        formData: {
          date: {
            label: 'Date',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_name: {
            label: 'Patron name',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Wavier,
        formData: {
          brand_name: {
            label: 'Brand legal name',
            value: '-',
            type: 'input',
            disabled: true
          },
          address: {
            label: 'Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          founder_name: {
            label: 'Founder name',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      }
    ]
  },
  [DocType.DebentureTrustDeed]: {
    tabList: [
      {
        tabName: Tabs.Brand,
        formData: {
          brand_legal_name: {
            label: 'Brand legal name',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_cin: {
            label: 'CIN',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_reg_address: {
            label: 'Reg Address',
            value: '-',
            type: 'input',
            disabled: true
          },
          brand_description: {
            label: 'Brand description',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Deal,
        formData: {
          deb_series: {
            label: 'Debenture Series',
            value: '-',
            type: 'input',
            disabled: true
          },
          no_of_deb: {
            label: 'No. of debentures',
            value: '-',
            type: 'input',
            disabled: true
          },
          total_amount: {
            label: 'Total Amount',
            value: '-',
            type: 'input',
            disabled: true
          },
          purpose_of_fund_raise: {
            label: 'Purpose of Fund raise',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.Director,
        contentType: 'Accordion',
        formData: {
          director_name: {
            label: 'Director Name',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_pan: {
            label: 'PAN',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_email: {
            label: 'Email',
            value: '-',
            type: 'input',
            disabled: true
          },
          director_mobile: {
            label: 'Mobile',
            value: '-',
            type: 'input',
            disabled: true
          },
          patron_permanent_address: {
            label: 'Director Address',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.ImportantDates,
        formData: {
          board_resolution_date: {
            label: 'Board Resolution date',
            value: '-',
            type: 'input',
            disabled: true
          },
          EGM_MGT_date: {
            label: 'EGM/MGT Date',
            value: '-',
            type: 'input',
            disabled: true
          },
          deb_trustee_agreement_date: {
            label: 'Debenture Trustee agreement date',
            value: '-',
            type: 'input',
            disabled: true
          },
          engagement_letter_date: {
            label: 'Engagement Letter Date',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.RevenueShare,
        formData: {
          fixed_yield_of_deb: {
            label: 'Fixed yield of Debenture',
            value: '-',
            type: 'input',
            disabled: true
          },
          total_revenue_share: {
            label: 'Total Revenue Share',
            value: '-',
            type: 'input',
            disabled: true
          },
          repayment_of_the_principle: {
            label: 'Repayment of the principle',
            value: '-',
            type: 'input',
            disabled: true
          },
          repayment_of_interest: {
            label: 'Repayment of Interest',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      },
      {
        tabName: Tabs.HypothecatedProperty,
        formData: {
          hypothicated_property: {
            label: 'Hypothecated Property',
            value: '-',
            type: 'input',
            disabled: true
          }
        }
      }
    ]
  },
  [DocType.PaymentGateway]: {
    tabList: [
      {
        tabName: Tabs.Pg,
        formData: {
          pg_account_type: {
            label: 'PG account type',
            value: 'Razorpay',
            type: 'autocomplete',
            options: [
              {
                label: 'Razorpay',
                value: 'Razorpay'
              },
              {
                label: 'Cashfree',
                value: 'Cashfree'
              },
              {
                label: 'PayU',
                value: 'PayU'
              },
              {
                label: 'Paytm',
                value: 'Paytm'
              },
              {
                label: 'Paypal',
                value: 'Paypal'
              },
              {
                label: 'Stripe',
                value: 'Stripe'
              }
            ]
          },
          pg_account_name: {
            label: 'PG account name',
            value: '',
            type: 'input',
            disabled: false
          },
          pg_accouunt_number: {
            label: 'PG account number',
            value: '',
            type: 'input',
            disabled: false
          }
        }
      }
    ]
  },
  [DocType.COD]: {
    tabList: [
      {
        tabName: Tabs.COD,
        formData: {
          cod_account_type: {
            label: 'COD account type',
            value: '',
            type: 'autocomplete',
            options: [
            ]
          },
          cod_account_name: {
            label: 'COD account name',
            value: '',
            type: 'input',
            disabled: false
          },
          cod_accouunt_number: {
            label: 'COD account number',
            value: '',
            type: 'input',
            disabled: false
          }
        }
      }
    ]
  },
  [DocType.Marketplace]: {
    tabList: [
      {
        tabName: Tabs.Marketplace,
        formData: {
          marketplace_account_type: {
            label: 'Marketplace account type',
            value: '',
            type: 'autocomplete',
            options: [
            ]
          },
          marketplace_account_name: {
            label: 'Marketplace account name',
            value: '',
            type: 'input',
            disabled: false
          },
          marketplace_accouunt_number: {
            label: 'Marketplace account number',
            value: '',
            type: 'input',
            disabled: false
          }
        }
      }
    ]
  },
  [DocType.POS]: {
    tabList: [
      {
        tabName: Tabs.Pos,
        formData: {
          pos_account_type: {
            label: 'PoS account type',
            value: 'PayU',
            type: 'autocomplete',
            options: [
              {
                label: 'PayU',
                value: 'PayU'
              },
              {
                label: 'Pinelabs',
                value: 'Pinelabs'
              },
              {
                label: 'Ezetap',
                value: 'Ezetap'
              },
              {
                label: 'Mpos',
                value: 'Mpos'
              },
              {
                label: 'Mswipe',
                value: 'Mswipe'
              }
            ]
          },
          pos_account_name: {
            label: 'PoS account name',
            value: '',
            type: 'input',
            disabled: false
          },
          pos_account_number: {
            label: 'PoS account number',
            value: '',
            type: 'input',
            disabled: false
          }
        }
      }
    ]
  },
  [DocType.POSWithPaymentGateway]: {
    tabList: [
      {
        tabName: Tabs.Pos,
        formData: {
          category: {
            label: 'category',
            value: 'PG',
            type: 'select',
            options: [
              {
                label: 'PG',
                value: 'PG'
              },
              {
                label: 'POS',
                value: 'POS'
              }
            ]
          },
          type: {
            label: 'Type',
            value: 'Razorpay',
            type: 'select',
            options: [
              {
                label: 'Razorpay',
                value: 'Razorpay'
              },
              {
                label: 'Cashfree',
                value: 'Cashfree'
              },
              {
                label: 'PayU',
                value: 'PayU'
              },
              {
                label: 'Paytm',
                value: 'Paytm'
              }
            ]
          },
          minContribution: {
            label: 'Min Contribution',
            value: '',
            type: 'input',
            disabled: false
          },
          splitPercentage: {
            label: 'Split Percentage(%)',
            value: '',
            type: 'input',
            disabled: false
          },
          isPrimary: {
            label: 'Is Primary',
            value: false,
            type: 'switch'
          }
        }
      }
    ]
  }
};

const LeegalitySignerStatus = {
  PENDING: 'Pending',
  SIGNED: 'Signed',
  EXPIRED: 'Expired',
  REJECTED: 'Rejected'
};

export { DocStatuses, dummyTableData, DialogData, DocType, DealInvestmentStatus, Tabs, LeegalitySignerStatus };
