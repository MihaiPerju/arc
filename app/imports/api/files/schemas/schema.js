import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    fileName: {
        type: String
    },
    previousFileId: {
        type: String,
        optional: true
    },
    facilityId: {
        type: String
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        },
    }
});