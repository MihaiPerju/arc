import Uploads from '../uploads/collection';
import Uploader from './s3';

Uploads.before.insert (function (userId, doc) {
  doc.uploadedAt = new Date ();
});
