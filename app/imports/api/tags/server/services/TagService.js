import Tags from '/imports/api/tags/collection.js';
import Users from '/imports/api/users/collection.js';

export default class TagService {
    static createTag ({data, _id}) {
        const tagId = Tags.insert(data);
        if(_id) {
            this.addTagToUser({_id, tagId});
        }
        return tagId
    }

    static addTagToUser ({_id, tagId}) {
        Users.update(
            {_id},
            {$push: {tagIds: tagId}}    
        )
    }
}