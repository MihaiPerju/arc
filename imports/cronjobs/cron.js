import FacilityFileScan from './server/FacilityFileScan';

SyncedCron.add({
    name: 'Test cronjob',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.recur().every(1).minute();
    },
    job: function () {
        // FacilityFileScan.run();
    }
});