export default {
  axisData: [
    { value: "facCode", label: "Facility Code" },
    { value: "ptType", label: "Patient Type" },
    { value: "ptName", label: "Patient Name" },
    { value: "dischrgDate", label: "Discharge Date" },
    { value: "fbDate", label: "Last Bill Date" },
    { value: "acctBal", label: "Account Balance" },
    { value: "finClass", label: "Financial Class" },
    { value: "admitDate", label: "Admit Date" },
    { value: "medNo", label: "Medical Number" },
    { value: "createdAt", label: "Created At" }
  ],
  types: {
    dates: ["dischrgDate", "fbDate", "admitDate", "createdAt"],
    numbers: ["acctBal", "medNo"],
    strings: ["ptType", "ptName", "finClass", "facCode"]
  }
};

const graphTypeEnum = [
  { value: "line", label: "Line Graph" },
  { value: "pie", label: "Pie Graph" },
  { value: "bar", label: "Bar Graph" },
  { value: "scatter", label: "Scatter Graph" },
  { value: "column", label: "Column Graph" },
  { value: "area", label: "Area Graph" }
];

export { graphTypeEnum };
