export default [
    {label: "Account Number", value: "Account Number"},
    {label: "Facility Code", value: "Facility Code",},
    {label: "Patient Type", value: "Patient Type",},
    {label: "Patient Name", value: "Patient Name",},
    {label: "Discharge Date", value: "Discharge Date",},
    {label: "Last Bill Date", value: "Last Bill Date",},
    {label: "Account Balance", value: "Account Balance",},
    {label: "Financial Class", value: "Financial Class",},
    {label: "Admit Date", value: "Admit Date",},
    {label: "Medical Number", value: "Medical Number",},
    {label: "State", value: "State",},
    {label: "Substate", value: "Substate",},
    {label: "User Last Name", value: "User Last Name",},
    {label: "User First Name", value: "User First Name",},
]
export const variablesEnum = {
    "Account Number": {
        field: "acctNum",
        scope: "account"
    },
    "Facility Code": {
        field: "facCode",
        scope: "account"
    },
    "Patient Type": {
        field: "ptType",
        scope: "account"
    },
    "Patient Name": {
        field: "ptName", scope: "account"
    },
    "Discharge Date": {
        field: "dischrgDate",
        scope: "account"
    },
    "Last Bill Date": {
        field: "fbDate",
        scope: "account"
    },
    "Account Balance": {
        field: "acctBal",
        scope: "account"
    },
    "Financial Class": {
        field: "finClass",
        scope: "account"
    },
    "Admit Date": {
        field: "admitDate",
        scope: "account"
    },
    "Medical Number": {
        field: "medNo",
        scope: "account"
    },
    "State": {
        field: "state",
        scope: "account"
    },
    "Substate": {
        field: "substate",
        scope: "account"
    },
    "User Last Name": {
        field: "lastName",
        scope: "user"
    },
    "User First Name": {
        field: "firstName",
        scope: "user"
    },
};
