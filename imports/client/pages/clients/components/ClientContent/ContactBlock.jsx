import React, {Component} from 'react';

export default class ContactBlock extends Component {
    render() {
        const {client} = this.props;
        console.log(client.contacts);
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">contact information</div>
                </div>
                <div className="main__block">
                    {
                        client.contacts && client.contacts.map((contact) => {
                            return (
                                <ul className="contact-info">
                                    <li className="text-center">
                                        <div className="text-light-grey">First name</div>
                                        <div className="l-info">{contact.firstName}</div>
                                    </li>
                                    <li className="text-center">
                                        <div className="text-light-grey">Last name</div>
                                        <div className="l-info">{contact.lastName}</div>
                                    </li>
                                    <li className="text-center">
                                        <div className="text-light-grey">Contact type</div>
                                        <div className="l-info">{contact.contactType}</div>
                                    </li>
                                    <li className="text-center">
                                        <div className="text-light-grey">Phone</div>
                                        <div className="l-info">{contact.phone}</div>
                                    </li>
                                    <li className="text-center">
                                        <div className="text-light-grey">Email</div>
                                        <div className="l-info">{contact.email}</div>
                                    </li>
                                </ul>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
} 