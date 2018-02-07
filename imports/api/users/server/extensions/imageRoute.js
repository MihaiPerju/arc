import Uploads from '/imports/api/s3-uploads/uploads/collection';
import fs from 'fs';

Picker.route('/image/:_id', function (params, req, res, next) {
    const {_id} = params;
    const avatar = Uploads.findOne({_id});
    const {path} = avatar;
    const file = fs.readFileSync(path);

    res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename=${params._id}.jpeg`,
        'Content-Length': file.length
    });
    res.end(file);
});