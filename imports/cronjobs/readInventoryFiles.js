SyncedCron.add({
    name: 'Test cronjob',
    schedule: function (parser) {
        // parser is a later.parse object
        return parser.recur().every(1).minute();
    },
    job: function () {
        console.log("tat normal!");
    }
});