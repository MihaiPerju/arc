const reportTypes = {
  ACCOUNTS: "accounts",
  ACCOUNT_ACTIONS: "accountActions"
};

const typeOptionsEnum = [
  { value: reportTypes.ACCOUNTS, label: "Accounts" },
  { value: reportTypes.ACCOUNT_ACTIONS, label: "Accounts Actions" }
];

const allowedValues = [reportTypes.ACCOUNTS, reportTypes.ACCOUNT_ACTIONS];

export { reportTypes, allowedValues };
export default typeOptionsEnum;
