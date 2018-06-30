import Letters from "/imports/api/letters/collection.js";
import Accounts from '/imports/api/accounts/collection';
import Uploads from '/imports/api/s3-uploads/uploads/collection';

Letters.addLinks({
    account: {
        type: 'one',
        collection: Accounts,
        field: 'accountId'
    },
    attachments: {
        type: 'many',
        collection: Uploads,
        field: 'attachmentIds'
    },
});