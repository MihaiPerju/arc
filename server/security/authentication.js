const LdapUser = require('./LdapUser');
const addHours = require('date-fns/add_hours');

//TODO: In the futue possible share queries from dataSources to avoid duplication

/**
 * This is a wrapper around loginUser for AD class, it handles all the extras for this app
 *    and creates a session for a user if successful
 * @param {String} username The UPN of the user
 * @param {String} password The password for the user
 * @param {ActiveDirectory} myAD The ActiveDirectory class object
 * @returns {Object} Returns standard object of {success: Boolean, reason: 'Error' || userId, sessionID, groups}
 */
async function loginWithAd(username, password, myAD) {
    try {
        // Try to authenticate with Active Directory
        const res = await myAD.loginUser(username, password);
        if (!res.success) {
            return {success: false, reason: res.message}
        }

        // Create a user object
        const user = new LdapUser(ActiveDirectory.createUserObj(res.entry), app.locals.db);

        // Create or update user account
        await user.updateUser(true);

        // Create a new session for the user
        const expires = addHours(new Date, 10);
        const sessionId = await user.createSession(expires);

        if (!sessionId)
            return {success: false, reason: "Error creating session"}

        return {success: true, userId: user._id, sessionId, groups}
    } catch(err) {
        console.error(err); // TODO Replace w/ logging
        return {success: false, reason: "Backend Error"}
    }
}

// Session middleware
const validateSession = function (req,res,next) {
    // No need to check sessions on login or creation of account
    if(req.path === '/api/login')
        return next()

    // If cookies are missing skip
    if(!req.user.userId || !req.session.sessionId)
        return next({loggedIn: false})

    // Create a user object from the user cookie
    app.locals.db.collection('ldapUsers').findOne({_id: req.user.userId})
        .then(data => {
            const user = new LdapUser(data, app.locals.db)
            const validSession = user.validateSession(req.session.sessionId);
            
            // If user has valid session proceed in app and attach user to the locals variable
            if(validSession === true) {
                req.locals.user = user;
                return next()
            }

            return next({loggedIn: false})
        })
        .catch(err => {
            //TODO: Add logging here
            return next({loggedIn: false})
        })

    
};

module.exports.loginWithAd = loginWithAd;
module.exports.validateSession = validateSession;