const cookie = require('client-sessions');

//TODO: Add production config settings to this file
// Cookie settings
exports.sessionCookie = cookie({
    secret: 'ad4XPCh6kHsAKQCv', // should be a large unguessable string
    cookieName: 'session', // cookie name dictates the key name added to the request object
    duration: 10 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        //path: '/', // cookie will only be sent to requests under '/'
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
});

exports.userCookie = cookie({
    secret: 'aGsYF3puxjLC4tjR', // should be a large unguessable string
    cookieName: 'user', // cookie name dictates the key name added to the request object
    duration: 10 * 60 * 60 * 1000, // how long the session will stay valid in ms
    cookie: {
        //path: '/', // cookie will only be sent to requests under '/'
        ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
});