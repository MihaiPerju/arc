import Uploads from '../uploads/collection';

Uploads.before.insert (function (userId, doc) {
  doc.uploadedAt = new Date ();
});
