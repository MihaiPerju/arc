import React from 'react';
import { Table } from 'semantic-ui-react';

export default class FacilityContactsTable extends React.Component {
    render () {
        const {contacts} = this.props;
        return (
            <Table padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>No.</Table.HeaderCell>
                        <Table.HeaderCell>First name</Table.HeaderCell>
                        <Table.HeaderCell>Last name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Phone</Table.HeaderCell>
                        <Table.HeaderCell>Notes</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {contacts.map((contact, index) => (
                        <Table.Row>
                            <Table.Cell>{(index + 1)}</Table.Cell>
                            <Table.Cell>{contact.firstName}</Table.Cell>
                            <Table.Cell>{contact.lastName}</Table.Cell>
                            <Table.Cell>{contact.contactType}</Table.Cell>
                            <Table.Cell>{contact.email}</Table.Cell>
                            <Table.Cell>{contact.phone}</Table.Cell>
                            <Table.Cell>{contact.notes}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    }
}