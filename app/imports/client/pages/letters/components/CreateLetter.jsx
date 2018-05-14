import React from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class CreateLetter extends React.Component {
    createLetter = () => {
        const {letterBody, accountId, reset, attachments} = this.props;

        const data = {
            body: letterBody,
            accountId,
            attachments
        };

        Meteor.call('letter.create', data, (err) => {
            if (err) {
                Notifier.error('Error while trying to create letter!');
            } else {
                Notifier.success('Letter successfully created!');
                reset();
            }
        });
    };

    render() {
        return (
            <button onClick={this.createLetter} className="btn--green btn-save">Save</button>
        );
    }
}