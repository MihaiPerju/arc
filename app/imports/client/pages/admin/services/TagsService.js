export default class TagsService {

    static getTagName (tag) {

        return `${tag.name} (${this.getTagPrivacy(tag)})`;
    }

    static getTagPrivacy (tag) {
        let privacy = tag.privacy;

        if (tag.visibility && privacy == 'Specific roles') {
            privacy = tag.visibility.join(', ');
        }

        return privacy;
    }
}