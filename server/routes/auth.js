const router = require('express').Router();
const jsonParser = require('body-parser').json();
const {loginWithAd} = require('../security/authentication');

// Request full LDAP sync
router.post('/login', jsonParser, (req,res) => {
    if(!req.body.username || !req.body.password) {
        res.json({success: false, reason: 'Missing Credentials'});
        return;
    }

    loginWithAd(req.body.username, req.body.password, req.app.locals.myAD)
        .then(data => {
            if(data.success === true) {
                // * This sets the cookie to be returned
                req.session.sessionId = data.sessionId;
                req.user.guid = data.guid;
            }

            res.json(data);
        })
        .catch(err => {
            console.error(err); //TODO attach logging
            res.json({success: false, reason: 'Backend Error'});
        })
});

// Test session is used to check if user has a valid session when app loads
router.get('/testSession', (req, res) => {
    // Middleware is testing session, if invalid it will respond for us
    // TODO send back the users groups here
    res.json({loggedIn: true})
});

module.exports = router;