import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table, Button} from 'semantic-ui-react';
import moment from 'moment';
import {getToken} from '/imports/api/s3-uploads/utils';

export default class LetterRow extends React.Component {
    handleDelete = (letterId) => {
        Meteor.call('letter.delete', letterId, (err) => {
            if (err) {
                return Notifier.error('Error while removing letter!');
            }

            Notifier.success('Letter deleted!');
            FlowRouter.reload();
        });
    };

    formatDate = (date) => {
        return moment(date).format('MM/DD/YYYY hh:mm');
    };

    render() {
        const {letter} = this.props;
        const accountId = FlowRouter.current().params._id;

        return (
            <Table.Row>
                <Table.Cell>{letter._id}</Table.Cell>
                <Table.Cell>{letter.status}</Table.Cell>
                <Table.Cell>{this.formatDate(letter.createdAt)}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button
                            primary
                            onClick={() => (
                                FlowRouter.go('letter.view',
                                    {accountId, letterId: letter._id})
                            )}>
                            View
                        </Button>
                        <Button
                            href={`/letters/pdf/${accountId}/${letter._id}/${getToken()}`}
                            target="_blank">
                            Download PDF
                        </Button>
                        <Button color="red"
                                onClick={() => (this.handleDelete(
                                    letter._id))}>
                            Delete
                        </Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}