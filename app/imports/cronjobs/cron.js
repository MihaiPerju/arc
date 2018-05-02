import FacilityFileScan from './server/FacilityFileScan';

SyncedCron.add({
    name: 'Scan files from every facility folder',
    schedule: function (parser) {
        return parser.recur().every(30).minute();
    },
    job: function () {
        const fileScan = new FacilityFileScan();
        fileScan.run();
    }

});