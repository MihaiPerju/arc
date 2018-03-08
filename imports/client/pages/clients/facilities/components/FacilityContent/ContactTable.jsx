import React, {Component} from 'react';

export default class ContactTable extends Component {
    render() {
        const tables = [
            {
                header: 'First Name',
                row: [
                    {name: 'yo'},
                    {name: 'none'},
                    {name: 'none'}
                ]
            },
            {
                header: 'Last name',
                row: [
                    {name: 'yo'},
                    {name: 'none'},
                    {name: 'none'}
                ]
            },
            {
                header: 'Phone',
                row: [
                    {name: 'yo'},
                    {name: 'none'},
                    {name: 'none'}
                ]
            },
            {
                header: 'Email',
                row: [
                    {name: 'yo'},
                    {name: 'none'},
                    {name: 'none'}
                ]
            },
            {
                header: 'Contact type',
                row: [
                    {name: 'yo'},
                    {name: 'none'},
                    {name: 'none'}
                ]
            }
        ];

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contacts</div>
                </div>
                <div className="main__block">
                    <div className="table">
                        {
                            tables.map(function (table, index) {
                                return (
                                    <div className="table-col text-center" key={index}>
                                        <div className="table-header text-light-grey">{table.header}</div>
                                        <div className="table-row">{table.row[0].name}</div>
                                        <div className="table-row">{table.row[1].name}</div>
                                        <div className="table-row">{table.row[2].name}</div>
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