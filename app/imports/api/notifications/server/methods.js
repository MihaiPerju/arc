import Notifications from "../collection.js";
import moment from 'moment';
import ActionService from '../../accounts/server/services/ActionService';

Meteor.methods({
  "notification.create"(data) {
    Notifications.insert(data);
  },
  "notification.remove"(_id) {
    Notifications.remove({ _id });
  },
  "notification.setAsSeen"(_id) {
    Notifications.update(
      { _id },
      {
        $set: { seen: true }
      }
    );
  },

  "notifications.get"(dateRangeFilter) {
    let filter = { 'seen': false };
    if (dateRangeFilter)
      filter['createdAt'] = dateRangeFilter;
    return Notifications.find(filter).fetch();
  },

  async "notifications.getPerHour"(dateRangeFilter) {
    let filter = { 'seen': false };

    let NotificationRaw = Notifications.rawCollection();
    NotificationRaw.aggregateSync = Meteor.wrapAsync(NotificationRaw.aggregate);

    if (dateRangeFilter)
      filter['createdAt'] = dateRangeFilter;

    const notificationsPerHour = await NotificationRaw.aggregateSync([{
      $match: filter,
    },
    {
      $group: {
        _id: {
          y: {
            $year: '$createdAt'
          },
          m: {
            $month: '$createdAt'
          },
          d: {
            $dayOfMonth: '$createdAt'
          },
          h: {
            $hour: '$createdAt'
          },
        },
        total: {
          $sum: 1
        },
      },
    },
    ]).toArray();
    return ActionService.graphStandardizeData(notificationsPerHour);
  },

});
