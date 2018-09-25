import UploadedFile from './UploadedFile';
import config from '../config';
import moment from 'moment';

export default class Uploader {
    static isImage(filename) {
        return Uploader.guessMimeType(filename).search('image') !== -1;
    }

    static guessMimeType(fileName) {
        let path = Npm.require("path");
        let ext = (path.extname(fileName).slice(1)).toLowerCase();

        return config.mimeTypes[ext] || 'text/plain';
    }

    static upload(filePath, fileKey) {
        let fs = Npm.require('fs');
        let os = Npm.require("os");

        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;

        let fileName = filePath.replace(os.tmpdir() + '/', '');

        const mimeType =  Uploader.guessMimeType(fileKey);

        const uploadedFile = new UploadedFile(fileName, fileKey, mimeType, fileSizeInBytes);

        if (Uploader.isImage(filePath)) {
            config.thumbs.forEach(size => {
                const thumbPath = Uploader.crop(filePath, size);

                uploadedFile.addThumb(size, thumbPath);
            });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return uploadedFile;
    }
};