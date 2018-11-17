import Files from "../collection";
import moment from "moment";

export default Files.createQuery("listSevenDaysFiles", {
  $filter({ filters, options, params }) {
    let sevenDaysAgoDate = moment()
      .subtract(7, "days")
      .toDate();

    _.extend(params.filters, {
      createdAt: {
        $gte: sevenDaysAgoDate
      }
    });
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  fileName: 1,
  status: 1,
  type: 1,
  corruptRows: 1,
  hasHeader: 1,
  createdAt: 1
});
