import { Accounts } from 'meteor/accounts-base';
import config from './config';

export function path(key) {
    return config.AWS_URL + '/' + key;
};

export function getToken() {
    return Accounts._storedLoginToken();
}