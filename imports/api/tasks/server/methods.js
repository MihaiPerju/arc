import {Meteor} from 'meteor/meteor';
import Tasks from '../collection';
import Mongo from 'meteor/mongo';

Meteor.methods({
    'tasks.create'(data) {
        const RowTasks = Tasks.rawCollection();
        RowTasks.insert(data);
    },

    'tasks.update'(data) {
        Tasks.update({acctNum:})
    }
});