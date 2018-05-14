import React from 'react';
import Notifier from '/imports/client/lib/Notifier';

export default class CreateLetter extends React.Component {
    createLetter = () => {
        const {letterBody, accountId, reset, attachments, letterTemplateId, keywordsValues} = this.props;

        const data = {
            body: letterBody,
            accountId,
            attachments,
            letterTemplateId,
            letterValues: keywordsValues
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
        const {hasKeywords} = this.props;
        const isDisabled = hasKeywords || this.doCheck();
        return (
            <button
                style={isDisabled ? {cursor: 'not-allowed'}: {}}
                disabled={isDisabled}
                onClick={this.createLetter}
                className="btn--green btn-save"> Save
            </button>
        );
    }
}