let commonRules = [{
        value: 'acctNum',
        label: 'Account Number',
        optional: false
    },
    {
        value: 'facCode',
        label: 'Facility Code',
        optional: true
    },
    {
        value: 'ptType',
        label: 'Patient Type',
        optional: true
    },
    {
        value: 'ptName',
        label: 'Patient Name',
        optional: false
    },
    {
        value: 'dischrgDate',
        label: 'Discharge Date',
        optional: false
    },
    {
        value: 'fbDate',
        label: 'Last Bill Date',
        optional: true
    },
    {
        value: 'acctBal',
        label: 'Account Balance',
        optional: true
    },
    {
        value: 'finClass',
        label: 'Financial Class',
        optional: true
    },
    {
        value: 'admitDate',
        label: 'Admit Date',
        optional: true
    },
    {
        value: 'medNo',
        label: 'Medical Number',
        optional: false
    },
    {
        value: 'invoiceNo',
        label: 'Invoice Number',
        optional: true
    },
    {
        value: 'activeInsCode',
        label: 'Active Insurance Code',
        optional: true
    },
    {
        value: 'other1',
        label: 'Other 1',
        optional: true
    },
    {
        value: 'other2',
        label: 'Other 2',
        optional: true
    }
];

export default {
    inventoryRules: commonRules,
    placementRules: commonRules,
    paymentRules: [{
            value: 'ptName',
            label: 'Patient Name',
            optional: true
        },
        {
            value: 'acctNum',
            label: 'Account Number',
            optional: false
        },
        {
            value: 'admitDate',
            label: 'Admit Date',
            optional: true
        },
        {
            value: 'dischrgDate',
            label: 'Discharge Date',
            optional: true
        },
        {
            value: 'payorCode',
            label: 'Payor Code',
            optional: false
        },
        {
            value: 'insName',
            label: 'Insurance Name',
            optional: true
        },
        {
            value: 'newAcctBal',
            label: 'New Account Balance',
            optional: true
        },
        {
            value: 'ptBal',
            label: 'Payment Balance',
            optional: true
        },
        {
            value: 'finClass',
            label: 'Financial Class',
            optional: true
        },
        {
            value: 'transDate',
            label: 'Transaction Date',
            optional: false
        },
        {
            value: 'transType',
            label: 'Transaction Type',
            optional: false
        },
        {
            value: 'transAmount',
            label: 'Transaction Amount',
            optional: false
        }
    ],
    types: {
        dates: ['dischrgDate', 'fbDate', 'admitDate', 'transDate'],
        numbers: ['acctBal', 'insBal', 'newAcctBal', 'ptBal', 'transAmount', ],
        strings: ['medNo', 'zip', 'address1', 'address2', 'insCode', 'city', 'state', 'policy', 'phone', 'transType', 'acctNum', 'payorCode', 'ptType', 'ptName', 'finClass', 'insName', 'facCode', 'activeInsCode', 'invoiceNo',"other1","other2"],
    }
}