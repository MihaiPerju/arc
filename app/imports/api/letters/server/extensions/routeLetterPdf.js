import { getUserByToken } from "/imports/api/s3-uploads/server/router";
import fs, { existsSync } from "fs";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";

Picker.route("/letters/pdf/:accountId/:letterId/:token", function(
  params,
  req,
  res,
  next
) {
  const user = getUserByToken(params.token);
  const { letterId } = params;
  const { rootFolder } = Settings.findOne({
    rootFolder: {
      $ne: null
    }
  });
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
    return;
  }

  const letterLocation =
    rootFolder + Business.ACCOUNTS_FOLDER + letterId + ".pdf";

  if (!existsSync(letterLocation)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  data = fs.readFileSync(letterLocation);

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${letterId}.pdf`
  });
  res.end(data);
});
