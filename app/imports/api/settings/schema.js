import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({

    suspendedUserIds: {
        type: Array,
        optional: true
    },
    'suspendedUserIds.$': {
        type: String
    },
    rootFolder:{
        type:String,
        optional:true
    },
    mailSetting: { type: Object, optional: true },
    "mailSetting.serverAddress": {
      type: String,
      optional: true,
    },
    "mailSetting.ssl": {
      type: Boolean,
      optional: true,
    },
    "mailSetting.port": {
        type: String,
        optional: true,
      },
    "mailSetting.authentication": {
      type: String,
      optional: true,
    },
    "mailSetting.username": {
        type: String,
        optional: true,
    },
    "mailSetting.password": {
    type: String,
    optional: true,
    },
    letterFolderPath:{
        type:String,
        optional:true
    },
    letterCompileTime: {
    type: String,
    optional: true,
    }

});