import React, { Component } from "react";
import NoteView from './NoteView';

export default class ContactBlock extends Component {
  render() {
    const { client } = this.props;
    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">contact information</div>
        </div>
        <div className="main__block">
          {client.contacts &&
            client.contacts.map((contact, index) => {
              return (
                <ul key={index} className="contact-info">
                  <li className="text-center">
                    <div className="text-light-grey">Status</div>
                    <div className="l-info">
                      {client.status ? "Active" : "Inactive"}
                    </div>
                  </li>
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
                  <li className="text-center">
                    <NoteView notes={contact.notes}/>
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    );
  }
}
