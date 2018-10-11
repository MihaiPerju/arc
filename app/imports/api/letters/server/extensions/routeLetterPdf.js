import { getUserByToken } from "/imports/api/uploads/server/router";
import fs, { existsSync } from "fs";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

Picker.route("/letters/pdf/:accountId/:letterId/:token", function(
  params,
  req,
  res
) {
  const user = getUserByToken(params.token);
  const { letterId } = params;
  const { root } = SettingsService.getSettings(settings.ROOT);
  const { letterDirectory } = SettingsService.getSettings(
    settings.LETTERS_DIRECTORY
  );

  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
    return;
  }

  const letterLocation = root + letterDirectory + letterId + ".pdf";

  if (!existsSync(letterLocation)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  const data = fs.readFileSync(letterLocation);

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${letterId}.pdf`
  });
  res.end(data);
});
