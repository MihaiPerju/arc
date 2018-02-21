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
        numbers: ['acctBal', 'medNo', 'insCode', 'insCode2', 'insCode3', 'insCode4', 'insBal', 'insBal2', 'insBal3', 'insBal4'],
        strings: ['acctNum', 'ptType', 'ptName', 'finClass', 'insName', 'insName2', 'insName3', 'insName4', 'facCode'],
    }
}