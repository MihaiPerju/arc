import React from 'react';
import Notifier from '/imports/client/lib/Notifier';
import {Table, Button} from 'semantic-ui-react';

export default class LetterRow extends React.Component {
    handleDelete = (letterId) => {
        Meteor.call('letter.delete', letterId, (err) => {
            if (err) {
                return Notifier.error('Error while removing letter!');
            }

            Notifier.success('Letter deleted !');
            FlowRouter.reload();
        });
    };

    render() {
        const {letter} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{letter._id}</Table.Cell>
                <Table.Cell>{letter.status}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button color="red"
                                onClick={() => (this.handleDelete(letter._id))}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}