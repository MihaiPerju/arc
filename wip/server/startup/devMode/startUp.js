// * This file has the pre-setup and post-setup functions for dev mode

const figlet = require('figlet');

/**
 * This function runs before the express server is started.
 */
exports.preStart = function() {
    console.log('')
    console.log('+---------------+');
    console.log('|  IN DEV MODE  |');
    console.log('+---------------+');
    console.log('')
}

/**
 * Runs if the connection to the DB failed
 * @param {String} err Error return from DB connection attempt
 */
exports.failedDB = function(err) {
    console.log('+-------------------------+')
    console.log('| Failed to connect to DB |')
    console.log('|      ¯\\_(⊙︿⊙)_/¯       |')
    console.log('+-------------------------+')
    console.log('')
    console.log(err)
    process.exit(0)
}

/**
 * This function runs after the DB has been connected, but before express starts.
 */
exports.postDB = function() {
    console.log('+---------------------+')
    console.log('| DB is now connected |')
    console.log('|       \\(ᵔᵕᵔ)/       |')
    console.log('+---------------------+')
    console.log('')
}

/**
 * This function runs after the express server is running.
 * @param {Object} server This is what is returned from app.listen()
 */
exports.postStart = function(server) {
    const {address, port} = server.address();
    console.log('+---------------------------+');
    console.log('|   Express is now running  |');
    console.log(`|   http://${address}:${port}          |`);
    console.log('+---------------------------+');

    try {
        console.log(figlet.textSync('Feel The Code!', 'Big Money-ne'));
    } catch(err) {
        console.log('Error in pointless text print out... Continuing with startup')
        // // console.log(err);
    }
}