import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import Notifier from '/imports/client/lib/Notifier';

export default class ReasonCodesList extends Component {
    removeReason (index) {
        const {reasonCodes} = this.props;
        const {onChange} = this.props;

        Meteor.call('reasonCode.delete', reasonCodes[index]._id, (err) => {
            if (!err) {
                Notifier.success('Reason code has been deleted !');
            } else {
                Notifier.error('An error has occured: ' + err.reason);
            }
        });

        reasonCodes.splice(index, 1);
        onChange(reasonCodes);
    }

    render () {
        const {reasonCodes} = this.props;

        return (
            <Table padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {reasonCodes.map((reasonCode, index) => (
                        <Table.Row>
                            <Table.Cell>{reasonCode.reason}</Table.Cell>
                            <Table.Cell>
                                <Button onClick={this.removeReason.bind(this, index)} color="red">Remove</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}