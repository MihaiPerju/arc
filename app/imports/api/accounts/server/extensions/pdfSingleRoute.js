import Uploads from '/imports/api/s3-uploads/uploads/collection';
import {getUserByToken} from '/imports/api/s3-uploads/server/router';
import fs from 'fs';
import Settings from '/imports/api/settings/collection.js';
import Business from '/imports/api/business';

Picker.route ('/pdf/:_id/:accountId/:token', function (params, req, res, next) {
  //Checking user rights
  const user = getUserByToken (params.token);
  const {accountId} = params;

  if (!user) {
    res.writeHead (404);
    res.write ('Not logged in!');
  }

  const {rootFolder} = Settings.findOne ({
    rootFolder: {
      $ne: null,
    },
  });

  const {_id} = params;
  const {path} = Uploads.findOne ({
    _id,
  });
  if (
    !fs.existsSync (
      rootFolder + Business.ACCOUNTS_FOLDER + accountId + '/' + path
    )
  ) {
    res.writeHead (404);
    res.write ('File Not Found');
    res.end ();
  }

  let data = fs.readFileSync (
    rootFolder + Business.ACCOUNTS_FOLDER + accountId + '/' + path
  );

  res.end (data);
});
