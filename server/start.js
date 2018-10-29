/**
 * This is the start script, anything that needs to be done before the
 * app starts should be placed in this file.
 */

const MongoClient = require('mongodb').MongoClient;
const startupFn = process.env.NODE_ENV === 'production' ? require('./startup/productionMode/startUp') : require('./startup/devMode/startUp');
const config = process.env.CONFIG ? require(process.end.CONFIG) : require('./startup/devMode/devConfig');

// Pre-Start hook
startupFn.preStart();

MongoClient.connect(config.databaseSettings.mongoURI, config.databaseSettings.options)
    .then(client => {

        // Post DB hook
        startupFn.postDB();

        require('./server');
    })
    .catch(err => {
        startupFn.failedDB(err)
        process.exit(0)
    });