import React, {Component} from 'react';
import NoteView from './../../../components/ClientContent/NoteView';

export default class ContactTable extends Component {
    render() {
        const columns = ['First Name', 'Last Name', 'Phone', 'Email', 'Contact Type', 'Notes'];
        const {contacts} = this.props;

        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Contacts</div>
                </div>
                <div className="main__block">
                    <div className="table flex--helper flex--column">
                        <div className="table-row flex--helper">
                            {
                                columns.map((column, index) => (
                                    <div className="table-header table-cell text-center text-light-grey" key={index}>
                                        {column}
                                    </div>
                                ))
                            }
                        </div>
                        {
                            contacts && contacts.map((contact, index) => (
                                <div className="table-row flex--helper" key={index}>
                                    <div className="table-cell text-center">{contact.firstName}</div>
                                    <div className="table-cell text-center">{contact.lastName}</div>
                                    <div className="table-cell text-center">{contact.phone}</div>
                                    <div className="table-cell text-center">{contact.email}</div>
                                    <div className="table-cell text-center">{contact.contactType}</div>
                                    <div className="table-cell text-center">
                                        <NoteView notes={contact.notes}/>
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}