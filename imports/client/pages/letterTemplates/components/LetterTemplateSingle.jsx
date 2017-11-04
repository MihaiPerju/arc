import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button} from 'semantic-ui-react'

export default class LetterSingle extends Component {
    constructor() {
        super();
        autoBind(this);
    }

    deleteLetterTemplate() {
        Meteor.call('letterTemplate.delete', this.props.letterTemplate._id, (err) => {
            if (!err) {
                Notifier.success('Letter template deleted !');
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onEditLetterTemplate() {
        FlowRouter.go("/letter-template/:_id/edit", {_id: this.props.letterTemplate._id});
    }

    render() {
        const {letterTemplate} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{letterTemplate.name}</Table.Cell>
                <Table.Cell>
                    <Button.Group>
                        <Button primary onClick={this.onEditLetterTemplate}>Edit</Button>
                        <Button color="red" onClick={this.deleteLetterTemplate}>Delete</Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}