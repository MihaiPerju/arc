import NotificationSchema from "./schema.js";

const Notifications = new Mongo.Collection("notifications");

Notifications.attachSchema(NotificationSchema);

export default Notifications;
