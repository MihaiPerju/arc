import { Accounts } from 'meteor/accounts-base';

export function getToken() {
    return Accounts._storedLoginToken();
}