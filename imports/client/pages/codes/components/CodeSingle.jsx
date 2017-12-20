import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Button} from 'semantic-ui-react'
import {Table, Dropdown} from 'semantic-ui-react'

export default class CodeSingle extends Component {

    constructor() {
        super();
        autoBind(this);
    }

    deleteCode() {
        Meteor.call('code.delete', this.props.code._id, (err) => {
            if (!err) {
                Notifier.success('Code deleted !');
                FlowRouter.reload();
            }
        });
    }

    onEditCode() {
        FlowRouter.go("/code/:_id/edit", {_id: this.props.code._id});
    }

    render() {
        const {code} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{code.code}</Table.Cell>
                <Table.Cell>{code.action}</Table.Cell>
                <Table.Cell>{code.type}</Table.Cell>
                <Table.Cell>{code.description}</Table.Cell>
                <Table.Cell>{code.description_short}</Table.Cell>
                <Table.Cell>{code.denial_action}</Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary onClick={this.onEditCode}>Edit Code</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteCode}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}