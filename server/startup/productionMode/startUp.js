// * This file has the pre-setup and post-setup functions for dev mode

/**
 * This function runs before the express server is started.
 */
exports.preStart = function() {
    console.log('+----------------------+');
    console.log('|  IN PRODUCTION MODE  |');
    console.log('+----------------------+');
}

/**
 * Runs if the connection to the DB failed
 * @param {String} err Error return from DB connection attempt
 */
exports.failedDB = function(err) {
    console.log('+-------------------------+')
    console.log('| Failed to connect to DB |')
    console.log('+-------------------------+')
    console.log('')
    console.log(err)
    process.exit(0)
}

/**
 * This function runs after the DB has been connected, but before express starts.
 */
exports.postDB = function() {
    console.log('===================')
    console.log('DB is now connected')
    console.log('===================')
}

/**
 * This function runs after the express server is running.
 */
exports.postStart = function() {
    console.log('Express is now running')
}