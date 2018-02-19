import React from 'react';
import {Button} from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

export default class CreateLetter extends React.Component {
    createLetter = () => {
        const {letterBody, taskId, attachments} = this.props;
        const data = {
            body: letterBody,
            taskId,
            attachments
        };

        Meteor.call('letter.create', data, (err) => {
            if (err) {
                Notifier.error('Error while trying to create letter!');
            } else {
                Notifier.success('Letter successfully created!');
            }
        });
    };

    render() {
        return (
            <button onClick={this.createLetter} className="btn--green btn-save">Save</button>
        );
    }
}