import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
  suspendedUserIds: {
    type: Array,
    optional: true
  },
  'suspendedUserIds.$': {
    type: String
  },
  rootFolder: {
    type: String,
    optional: true
  },
  letterCompileTime: {
    type: String,
    optional: true,
  }

});