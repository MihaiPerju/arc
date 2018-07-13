import ReportColumn from "../collection";

export default ReportColumn.createQuery("reportColumnList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  acctNum: 1,
  facCode: 1,
  ptType: 1,
  ptName: 1,
  dischrgDate: 1,
  fbDate: 1,
  acctBal: 1,
  finClass: 1,
  admitDate: 1,
  medNo: 1,
  state: 1,
  substate: 1,
  activeInsCode: 1,
  insurances: 1
});
