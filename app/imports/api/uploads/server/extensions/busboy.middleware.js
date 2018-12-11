import { Random } from "meteor/random";
import Busboy from "busboy";
import Settings from "/imports/api/settings/collection";
import settings from "/imports/api/settings/enums/settings";

let fs = Npm.require("fs"),
  os = Npm.require("os"),
  path = Npm.require("path");

export default function(req, res, next) {
  let busboy = new Busboy({ headers: req.headers });
  req.filenames = [];
  req.postData = {};

  let store = {
    files: {}
  };

  let setting = Settings.findOne({ name: settings.ROOT });

  busboy.on("file", fileHandler(req, store, setting.root));
  busboy.on(
    "field",
    (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      req.postData[fieldname] = val;
    }
  );

  busboy.on("finish", onFinish(next, store));

  req.pipe(busboy);
}

const onFinish = (next, store) => {
  return function() {
    let finished = false;
    while (!finished) {
      finished = true;

      _.each(store.files, (fstream, saveTo) => {
        if (!fstream._writableState.ended) {
          finished = false;
        }
      });

      if (finished) {
        next();
        break;
      }

      Meteor._sleepForMs(50);
    }
  };
};

const fileHandler = (req, store, root) => {
  //pause execution for reading small files on local
  Meteor._sleepForMs(500);

  return function(fieldname, file, filename, encoding, mimetype) {
    // generating unique file name
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];

    filename =
      parts.slice(0, parts.length - 1) + "." + Random.id() + "." + extension;

    let movePath = root + filename;
    let fstream = fs.createWriteStream(movePath);

    req.filenames.push(movePath);

    store[movePath] = fstream;

    file.pipe(fstream);
  };
};
