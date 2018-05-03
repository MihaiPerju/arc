import CommentsSchema from './schemas/schema.js'

const Comments = new Mongo.Collection('comments');

Comments.attachSchema(CommentsSchema);

export default Comments;