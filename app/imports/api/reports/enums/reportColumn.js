export default [
  { value: "acctNum", label: "Account Number" },
  { value: "facCode", label: "Facility Code" },
  { value: "ptType", label: "Patient Type" },
  { value: "ptName", label: "Patient Name" },
  { value: "dischrgDate", label: "Discharge Date" },
  { value: "fbDate", label: "Last Bill Date" },
  { value: "acctBal", label: "Account Balance" },
  { value: "finClass", label: "Financial Class" },
  { value: "admitDate", label: "Admit Date" },
  { value: "medNo", label: "Medical Number" },
  { value: "state", label: "State" },
  { value: "substate", label: "Substate" },
  { value: "metaData", label: "Meta Data" },
  { value: "activeInsCode", label: "Active Insurance Code" },
  { value: "tickleDate", label: "Tickle Date" },
  { value: "tickleReason", label: "Tickle Reason" },
  { value: "workQueueId", label: "Work Queue" }
];

const insuranceColumnEnum = [
  { value: "insName", label: "Insurance Name" },
  { value: "insCode", label: "Insurance Code" },
  { value: "insBal", label: "Insurance Balance" },
  { value: "address1", label: "Address 1" },
  { value: "address2", label: "Address 2" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "policy", label: "Policy" },
  { value: "phone", label: "Phone" }
];

const types = {
  dates: ["dischrgDate", "fbDate", "admitDate", "createdAt", "tickleDate"]
};

const fields = {
  INSURANCES: "insurances",
  METADATA: "metaData"
};
export { insuranceColumnEnum };
export { types };
export { fields };
