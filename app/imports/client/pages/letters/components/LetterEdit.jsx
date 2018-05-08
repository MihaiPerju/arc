import React from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class LetterEdit extends React.Component {
    editLetter = () => {
        const {letterBody, taskId, reset, attachments, letterTemplateId, selectedLetterId} = this.props;

        const data = {
            body: letterBody,
            taskId,
            attachments,
            letterTemplateId
        };

        Meteor.call('letter.update', selectedLetterId, data, (err) => {
            if (err) {
                Notifier.error('Error while trying to update letter!');
            } else {
                Notifier.success('Letter successfully updated !');
                reset();
            }
        });
    };

    render() {
        return (
            <button onClick={this.editLetter} className="btn--green btn-save">Update</button>
        );
    }
}