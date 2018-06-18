import {getUserByToken} from '/imports/api/s3-uploads/server/router';
import Security from '/imports/api/accounts/security';
import {roleGroups} from '/imports/api/users/enums/roles';
import LetterService from '/imports/api/letters/server/letter.service.js';
import fs from 'fs';

Picker.route('/letters/pdf/:accountId/:letterId/:token',
    function(params, req, res, next) {
        const user = getUserByToken(params.token);

        if (!user) {
            res.writeHead(404);
            res.write('Not logged in!');
            return;
        }

        if (!Roles.userIsInRole(user._id, roleGroups.ALL) &&
            !Security.hasRightsOnAccount(user._id, params._id)) {
            res.writeHead(404);
            res.write('An error occurred');
            return;
        }

        const tmpPdfLocation = LetterService.getLetterTemporalPdfLoc(params.accountId, params.letterId);

        if (!tmpPdfLocation) {
            res.writeHead(404);
            res.write('An error occurred');
            return;
        }

        let data;
        try {
            data = fs.readFileSync(tmpPdfLocation);
        } catch (err) {
            res.writeHead(404);
            res.end('Error 404 - Not found.');
            return;
        }

        fs.unlink(tmpPdfLocation, (error) => {console.error(error)});
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${params.letterId}.pdf`,
        });
        res.end(data);
    });