import { createRoute } from "/imports/api/s3-uploads/server/router";
import Clients from "/imports/api/clients/collection";
import Uploads from "/imports/api/s3-uploads/uploads/collection";

createRoute(
  "/uploads/logo/:clientId/:token",
  ({ user, clientId, error, filenames, success, uploadLocal }) => {
    if (!user) {
      return error("Not Authorized");
    }

    if (filenames.length != 1) {
      return error("Invalid number of files");
    }
    const [uploadId] = uploadLocal({ clientId });
    const logo = Uploads.findOne({ _id: uploadId });
    const { path } = logo;

    Clients.update(
      { _id: clientId },
      {
        $set: {
          logoPath: path
        }
      }
    );
    success(uploadId);
  }
);
