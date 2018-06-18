import Accounts from "../collection";
import { createRoute } from "/imports/api/s3-uploads/server/router";
import RolesEnum from "/imports/api/users/enums/roles";
import Security from "/imports/api/accounts/security";

createRoute(
  "/uploads/account-pdf/:accountId/:token",
  ({ user, accountId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not logged in!");
    } else if (
      !Roles.userIsInRole(user._id, [RolesEnum.ALL]) &&
      !Security.hasRightsOnAccount(user._id, accountId)
    ) {
      return error("Not allowed!");
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
