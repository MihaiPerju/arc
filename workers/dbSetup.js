const MongoClient = require('mongodb').MongoClient;

const devOptions = {
    useNewUrlParser: true,
    ssl: true,
    sslValidate: true,
    checkServerIdentity: true
}

// Temp for dev testing
const devURI = 'mongodb+srv://arccTester:sZ5zViNL1jJBBD7v@arcc-testing-bxsso.mongodb.net/arcc'

/**
 * Connects to MongoDB
 * @param {String} uri A MongoDB URI string passed to MongoClient.
 * @param {Object} dbOptions A JSON object of MongoDB options, passed to MongoClient.
 */
async function connectToMongo(uri = devURI, dbOptions = devOptions) {
    try {
        return await MongoClient.connect(uri, dbOptions)
    } catch(err) {
        console.error('Error connecting to DB')
        if(process.env.NODE_ENV !== 'production')
            console.error(err)

        return false;
    }
}

module.exports.connectToMongo = connectToMongo;