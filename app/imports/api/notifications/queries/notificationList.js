import Notifications from "../collection";

export default Notifications.createNamedQuery("notificationList", {
  $filter({ filters, options, params }) {
    _.extend(filters, params.filters);
    _.extend(options, params.options);
  },
  $paginate: true,
  seen: 1,
  receiverId: 1,
  message: 1,
  type: 1,
  metaData: 1
});
