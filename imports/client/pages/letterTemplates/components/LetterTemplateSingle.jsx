import React, {Component} from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import {Table} from 'semantic-ui-react'
import {Button, Dropdown} from 'semantic-ui-react'

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
                    <Dropdown button text='Action' icon={null} simple>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary onClick={this.onEditLetterTemplate}>Edit</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteLetterTemplate}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}