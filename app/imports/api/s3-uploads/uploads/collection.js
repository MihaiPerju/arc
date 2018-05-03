import UploadsSchema from './schema';

const Uploads = new Mongo.Collection('uploads');

Uploads.attachSchema(UploadsSchema);

export default Uploads;

if (Meteor.isServer) {
    Uploads._ensureIndex({resourceType: 1, resourceId: 1});
}