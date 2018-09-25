import Accounts from '../collection';
import {createRoute} from '/imports/api/uploads/server/router';
import Settings from '/imports/api/settings/collection.js';
import Uploads from '/imports/api/uploads/uploads/collection';
import Business from '/imports/api/business';
import fs from 'fs';

createRoute (
  '/uploads/account-pdf/:accountId/:token',
  ({user, accountId, error, filenames, success, uploadLocal}) => {
    if (!user) {
      return error ('Not logged in!');
    }

    if (filenames.length != 1) {
      return error ('Invalid number of files');
    }

    const {rootFolder} = Settings.findOne ({
      rootFolder: {$ne: null},
    });

    const [uploadId] = uploadLocal ({accountId});
    const {path} = Uploads.findOne ({_id: uploadId});
    const movePath =
      rootFolder + Business.ACCOUNTS_FOLDER + accountId + '/' + path;
    fs.renameSync (rootFolder + path, movePath);

    Accounts.update (
      {_id: accountId},
      {
        $push: {
          attachmentIds: uploadId,
        },
      }
    );
    success ();
  }
);
