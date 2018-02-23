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
                FlowRouter.go('task.view', {_id: taskId});
            }
        });
    };

    render() {
        return (
            <Button primary
                    onClick={this.createLetter}>
                Create Letter
            </Button>
        );
    }
}