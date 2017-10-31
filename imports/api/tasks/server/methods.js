import {Meteor} from 'meteor/meteor';
import Tasks from '../collection';
import Mongo from 'meteor/mongo';

Meteor.methods({
    'tasks.create'(data) {
        const RowTasks = Tasks.rawCollection();
        RowTasks.insert(data);
    },

    'tasks.update'(data) {
        data.map(({
                      acctNum,
                      facCode,
                      ptType,
                      ptName,
                      dischrgDate,
                      fbDate,
                      acctBal,
                      finClass,
                      admitDate,
                      medNo,
                      insName,
                      insName2,
                      insName3,
                      insCode,
                      insCode2,
                      insCode3,
                      insBal,
                      insBal2,
                      insBal3,
                      state
                  }) => {
            Tasks.update({acctNum}, {
                $set: {
                    acctNum,
                    facCode,
                    ptType,
                    ptName,
                    dischrgDate,
                    fbDate,
                    acctBal,
                    finClass,
                    admitDate,
                    medNo,
                    insName,
                    insName2,
                    insName3,
                    insCode,
                    insCode2,
                    insCode3,
                    insBal,
                    insBal2,
                    insBal3,
                    state
                }
            })
        })
    }
});