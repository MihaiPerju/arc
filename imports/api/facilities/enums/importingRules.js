let commonRules = [
    {value: 'acctNum', label: 'Account Number', optional: true},
    {value: 'facCode', label: 'Facility Code', optional: true},
    {value: 'ptType', label: 'Pt Type', optional: true},
    {value: 'ptName', label: 'Pt Name', optional: true},
    {value: 'dischrgDate', label: 'Discharge Date', optional: true},
    {value: 'fbDate', label: 'Fb Date', optional: true},
    {value: 'acctBal', label: 'Acct Balance', optional: true},
    {value: 'finClass', label: 'Fin Class', optional: true},
    {value: 'admitDate', label: 'Admit Date', optional: true},
    {value: 'medNo', label: 'Med No', optional: true}
];

export default {
    inventoryRules: commonRules,
    placementRules: commonRules,
    paymentRules: [
        {value: 'ptName', label: 'Patient Name', optional: true},
        {value: 'acctNum', label: 'Account Number', optional: false},
        {value: 'admitDate', label: 'Admit Date', optional: true},
        {value: 'dischrgDate', label: 'Discharge Date', optional: true},
        {value: 'payorCode', label: 'Payor Code', optional: false},
        {value: 'insName', label: 'Insurance Name', optional: true},
        {value: 'newAcctBal', label: 'New Account Balance', optional: true},
        {value: 'ptBal', label: 'Payment Balance', optional: true},
        {value: 'finClass', label: 'Financial Class', optional: true},
        {value: 'transDate', label: 'Transaction Date', optional: false},
        {value: 'transType', label: 'Transaction Type', optional: false},
        {value: 'transAmount', label: 'Transaction Amount', optional: false}
    ],
    types: {
        dates: ['dischrgDate', 'fbDate', 'admitDate', 'transDate'],
        numbers: ['acctBal', 'medNo', 'insCode', 'insBal', 'newAcctBal', 'ptBal', 'transAmount'],
        strings: ['transType', 'acctNum', 'payorCode', 'ptType', 'ptName', 'finClass', 'insName', 'facCode'],
    }
}