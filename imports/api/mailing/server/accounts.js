import { Accounts } from 'meteor/accounts-base';
import Config from './config';

Accounts.emailTemplates.siteName = Config.name;
Accounts.emailTemplates.from = Config.from;

Accounts.emailTemplates.resetPassword.text = function (user, url) {
    url = url.replace('#/', '')
    return " To reset your password, simply click the link below:\n\n"
        + url;
};
