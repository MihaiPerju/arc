import React, { Component } from 'react';
import Notifier from '/imports/client/lib/Notifier';
import autoBind from 'react-autobind';
import { Table } from 'semantic-ui-react';
import { Button, Dropdown } from 'semantic-ui-react';

export default class InsuranceCompanySingle extends Component {
    constructor () {
        super();
        autoBind(this);
    }

    deleteCompany () {
        Meteor.call('inscompany.delete', this.props.inscompany._id, (err) => {
            if (!err) {
                Notifier.success('Insurance company deleted !');
                FlowRouter.reload();
            } else {
                Notifier.error(err.reason);
            }
        });
    }

    onEditCompany () {
        FlowRouter.go('/inscompany/:id/edit', {id: this.props.inscompany._id});
    }

    render () {
        const {inscompany} = this.props;

        return (
            <Table.Row>
                <Table.Cell>{inscompany.name}</Table.Cell>
                <Table.Cell>
                    {_.map(inscompany.aliases, (alias) => {
                        return alias + ' ';
                    })}
                </Table.Cell>
                <Table.Cell>
                    <Dropdown button text='Action' icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <Button primary onClick={this.onEditCompany}>Edit</Button>
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button color="red" onClick={this.deleteCompany}>Delete</Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    }
}