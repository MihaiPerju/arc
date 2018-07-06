import Accounts from "../collection";
import { createRoute } from "/imports/api/s3-uploads/server/router";

createRoute(
  "/uploads/account-pdf/:accountId/:token",
  ({ user, accountId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not logged in!");
    }

    if (filenames.length != 1) {
      return error("Invalid number of files");
    }

    const [uploadId] = uploadLocal();

    Accounts.update(
      { _id: accountId },
      {
        $push: {
          attachmentIds: uploadId
        }
      }
    );
    success();
  }
);
