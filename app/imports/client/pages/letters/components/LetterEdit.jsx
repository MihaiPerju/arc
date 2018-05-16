import React from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class LetterEdit extends React.Component {
    editLetter = () => {
        const {letterBody, accountId, reset, attachments, letterTemplateId, selectedLetterId, keywordsValues} = this.props;
        const data = {
            body: letterBody,
            accountId,
            attachments,
            letterTemplateId,
            letterValues: keywordsValues
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

    doCheck = () => {
        const {keywordsValues} = this.props;
        for (let key in keywordsValues) {
            if(!keywordsValues[key]) {
                return true;
            }
        }
        return false;
    }

    render() {
        const {hasKeywords, attachments} = this.props;
        let isDisabled = hasKeywords ? this.doCheck() : false;
        return (
            <button
                style={isDisabled ? {cursor: 'not-allowed'}: {}}
                disabled={isDisabled}
                onClick={this.editLetter}
                className="btn--green btn-save">Update
            </button>
        );
    }
}