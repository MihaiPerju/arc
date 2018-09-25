import Uploads from '../uploads/collection';

export default class {
    constructor(name, path, mimeType, size) {
        this.name = name;
        this.path = path;
        this.mimeType = mimeType;
        this.size = size;
        this.thumbs = {};
    }

    addThumb(size, path) {
        this.thumbs[`${size}x${size}`] = path;
    }

    save({
        resourceType,
        resourceId,
        userId
    }) {
        return Uploads.insert({
            path: this.path,
            name: this.name,
            mimeType: this.mimeType,
            thumbs: this.thumbs,
            size: this.size,
            resourceType,
            resourceId,
            userId
        })
    }
}