import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import { Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'

export default class ReasonCodeSingle extends Component {
    deleteReasonCode() {
        const {reasonCode} = this.props;

        Meteor.call('reasonCode.delete', reasonCode._id, (err) => {
            if (!err) {
                Notifier.success('Reason Code deleted !');
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    render() {
        const {reasonCode} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{reasonCode.reason}</Table.Cell>
                <Table.Cell>{reasonCode.action && reasonCode.action.title}</Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary href={"/reason-code/" + reasonCode._id + "/edit"}>Edit</Button>
                                <Button color="red" onClick={this.deleteReasonCode.bind(this)}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}