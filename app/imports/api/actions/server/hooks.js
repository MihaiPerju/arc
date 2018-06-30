import Actions from '../collection';

Actions.after.insert(function (actionId, doc) {
    doc.substate = 'N/A';
});