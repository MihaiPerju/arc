import Actions from '../collection';

Actions.before.insert(function (actionId, doc) {
    doc.state = 'N/A';
});