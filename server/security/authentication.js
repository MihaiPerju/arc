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
async function loginWithAd(username,password, myAD) {
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
        console.error(err);
        return {success: false, reason: "Backend Error"}
    }
}

module.exports.loginWithAd = loginWithAd;