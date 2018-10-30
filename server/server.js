const startupFn = process.env.NODE_ENV === 'production' ? require('./startup/productionMode/startUp') : require('./startup/devMode/startUp');
const config = process.env.CONFIG ? require(process.env.CONFIG) : require('./startup/devMode/devConfig');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// * Pre app setup hook
startupFn.preStart();

// Setup app middleware
const app = express();
app.disable('x-powered-by');


// Tmp schema test
const schema = buildSchema(`
  type Query {
    hello: String
    test: String
  }
`);

const root = { hello: () => 'Hello world!' };
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: root
}));

// Final error handle, for whatever else may have gone wrong
app.use((err,req,res,next) => {
    console.log(err);
    console.log(req.path);
    res.send('Internal error');
});

// * Setup the DB and then start the server
//TODO: Replace w/ fn that can auto test / reconnect DB connection
MongoClient.connect(config.databaseSettings.mongoURI, config.databaseSettings.options, (err, client) => {
    // DB error hook
    if(err) {
        startupFn.failedDB(err);
    }

    // Post DB hook
    startupFn.postDB();
    
    // Start web server
    const server = app.listen(config.appSettings.port || 3050, () => {
        startupFn.postStart(server)
    });
})