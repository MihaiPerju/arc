const startupFn = process.env.NODE_ENV === 'production' ? require('./startup/productionMode/startUp') : require('./startup/devMode/startUp');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphqlIndex = require('./graphQL/index');
const { existsSync } = require('fs');
const { ActiveDirectory } = require('node-ad-tools');
const { sessionCookie, userCookie } = require('./security/cookies');
const authRoutes = require('./routes/auth');

// Use user custom config or switch to default dev one
const config = existsSync('config.js') ? require('./config.js') : require('./startup/devMode/devConfig');

// * Pre app setup hook
startupFn.preStart();

// Setup app middleware
const app = express();
app.disable('x-powered-by');

// Decrypt cookies
app.use(sessionCookie);
app.use(userCookie);

// Setup routes
app.use('/api/auth', authRoutes);

// Setup graphQL
app.use('/api/graphql', graphqlHTTP({
    schema: graphqlIndex.schema,
    graphiql: true,
    rootValue: graphqlIndex.resolvers,
    context: app.locals
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
    app.locals.db = client.db(config.databaseSettings.databaseName);
    app.locals.myAD = new ActiveDirectory(config.adServer);
    
    // Start web server
    const server = app.listen(config.appSettings.port || 3050, () => {
        startupFn.postStart(server)
    });
});