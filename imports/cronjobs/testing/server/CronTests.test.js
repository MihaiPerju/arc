import {chai} from 'meteor/practicalmeteor:chai';

describe('Log message', function () {
    it("Must log a message every minute ", function () {
        SyncedCron.add({
            name: 'Test cronjob',
            schedule: function (parser) {
                return parser.recur().every(1).minute();
            },
            job: function () {
                console.log("Message displays every minute");
            }
        });

        SyncedCron.start();
    });
});