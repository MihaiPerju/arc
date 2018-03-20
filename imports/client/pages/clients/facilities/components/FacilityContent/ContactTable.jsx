import React, {Component} from 'react';

export default class ContactTable extends Component {
    render() {
        const columns = [
            {
                header: 'First Name',
                contactProp: 'firstName'
            },
            {
                header: 'Last Name',
                contactProp: 'lastName'
            },
            {
                header: 'Phone',
                contactProp: 'phone'
            },
            {
                header: 'Email',
                contactProp: 'email'
            },
            {
                header: 'Contact Type',
                contactProp: 'contactType'
            }
        ];
        const {contacts} = this.props;
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contacts</div>
                </div>
                <div className="main__block">
                    <div className="table">
                        {
                            columns.map(function (column, index) {
                                return (
                                    <div className="table-col text-center" key={index}>
                                        <div className="table-header text-light-grey">{column.header}</div>
                                        {
                                            contacts && contacts.map(function (contact) {
                                                return (
                                                    <div className="table-row">{contact[column.contactProp]}</div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}