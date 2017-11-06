import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Button} from 'semantic-ui-react'
import {Table} from 'semantic-ui-react'

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
                    <Button.Group>
                        <Button primary onClick={this.onEditCode}>Edit Code</Button>

                        <Button color="red" onClick={this.deleteCode}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}