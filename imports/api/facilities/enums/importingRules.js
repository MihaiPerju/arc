export default {
    importingRules: [
        {value: 'acctNum', label: 'Account Number'},
        {value: 'facCode', label: 'Facility Code'},
        {value: 'ptType', label: 'Pt Type'},
        {value: 'ptName', label: 'Pt Name'},
        {value: 'dischrgDate', label: 'Discharge Date'},
        {value: 'fbDate', label: 'Fb Date'},
        {value: 'acctBal', label: 'Acct Balance'},
        {value: 'finClass', label: 'Fin Class'},
        {value: 'admitDate', label: 'Admit Date'},
        {value: 'medNo', label: 'Med No'}
    ],
    types: {
        dates: ['dischrgDate', 'fbDate', 'admitDate'],
        numbers: ['acctBal', 'medNo', 'insCode','insBal'],
        strings: ['acctNum', 'ptType', 'ptName', 'finClass', 'insName', 'facCode'],
    }
}