const fields = [
  {
    name: 'ptType',
    operators: ['='],
    label: 'Patient Type',
    input: {type: 'text'},
  },
  {
    name: 'ptName',
    operators: ['='],
    label: 'Patient Name',
    input: {type: 'text'},
  },
  {
    name: 'dischrgDate',
    operators: ['='],
    label: 'Discharge Date',
    input: {type: 'date'},
  },
  {
    name: 'fbDate',
    operators: ['='],
    label: 'Last Bill Date',
    input: {type: 'date'},
  },
  {
    name: 'acctBal',
    operators: [
      '=',
      '<',
      'Greater',
      'Greater than',
      'Less than',
      'Less than or equal to',
    ],
    label: 'Account Balance',
    input: {type: 'number'},
  },
  {
    name: 'finClass',
    operators: 'all',
    label: 'Financial Class',
    input: {type: 'text'},
  },
  {
    name: 'admitDate',
    operators: ['='],
    label: 'Admit Date',
    input: {type: 'text'},
  },
  {name: 'state', operators: 'all', label: 'State', input: {type: 'text'}},
  {
    name: 'substate',
    operators: ['='],
    label: 'Substate',
    input: {type: 'text'},
  },
  {
    name: 'activeInsCode',
    operators: ['='],
    label: 'Active Insurance Code',
    input: {type: 'text'},
  },
  {
    name: 'tickleDate',
    operators: ['='],
    label: 'Tickle Date',
    input: {type: 'date'},
  },
  {
    name: 'tickleReason',
    operators: ['='],
    label: 'Tickle Reason',
    input: {type: 'text'},
  },
  {
    name: 'workQueueId',
    operators: ['='],
    label: 'Work Queue',
    input: {type: 'text'},
  },
  {
    name: 'acctNum',
    operators: ['='],
    label: 'Account Number',
    input: {type: 'text'},
  },
  {
    name: 'facCode',
    operators: ['='],
    label: 'Facility Code',
    input: {type: 'text'},
  },
  {
    name: 'medNo',
    operators: [
      '=',
      'Greater',
      'Greater than',
      'Less than',
      'Less than or equal to',
    ],
    label: 'Medical Number',
    input: {type: 'number'},
  },
];

export default fields;
