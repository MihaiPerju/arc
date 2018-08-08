import { getUserByToken } from "/imports/api/s3-uploads/server/router";
import LetterService from "/imports/api/letters/server/letter.service.js";
import fs, { existsSync } from "fs";

Picker.route("/letters/pdf/:accountId/:letterId/:token", function(
  params,
  req,
  res,
  next
) {
  const user = getUserByToken(params.token);
  const { letterId } = params;
  
  if (!user) {
    res.writeHead(404);
    res.write("Not logged in!");
    return;
  }

  const tmpPdfLocation = LetterService.getLetterTemporalPdfLoc(
    params.accountId,
    params.letterId
  );

  if (!existsSync(tmpPdfLocation)) {
    res.writeHead(404);
    res.write("File Not Found");
    res.end();
  }
  data = fs.readFileSync(tmpPdfLocation);

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${letterId}.pdf`
  });
  res.end(data);
});
