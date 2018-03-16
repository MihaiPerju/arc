import fs from 'fs';
import os from 'os';
import Business from '/imports/api/business';

Picker.route('/image/:path', function(params, req, res, next) {
    const { path } = params;
    const filePath = Business.LOCAL_STORAGE_FOLDER + '/' + path;
    const file = fs.readFileSync(filePath);

    res.writeHead(200, {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename=${params._id}.jpeg`,
        'Content-Length': file.length
    });
    res.end(file);
});
