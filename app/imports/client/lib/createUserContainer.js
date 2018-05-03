import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export default (component) => {
    return createContainer(() => {
        return {
            user: Meteor.user()
        }
    }, component)
}