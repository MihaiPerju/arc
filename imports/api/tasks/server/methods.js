import {Meteor} from 'meteor/meteor';
import Tasks from '../collection';

Meteor.methods({
    'tasks.create'(data) {
        Tasks.insert(data);
    }
});