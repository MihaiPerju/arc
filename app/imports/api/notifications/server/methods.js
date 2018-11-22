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

  "notifications.get"() {
    let filter = { 'seen': false };
    return Notifications.find(filter).fetch();
  },
  
  async "notifications.getPerHour"(date) {
    let filter = { 'seen': false };

    let NotificationRaw = Notifications.rawCollection();
    NotificationRaw.aggregateSync = Meteor.wrapAsync(NotificationRaw.aggregate);

    if (date && date != '-1')
      filter['createdAt'] = {
        $gte: new Date(moment(date).subtract(1, 'year').startOf('day')),
        $lt: new Date(moment(date).add(1, 'day').startOf('day')),
      };

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
