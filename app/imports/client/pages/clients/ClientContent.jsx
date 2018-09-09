import React, { Component } from "react";
import ClientContentHeader from "./components/ClientContent/ClientContentHeader";
import ContactBlock from "./components/ClientContent/ContactBlock";
import ClientTimeline from "./components/ClientContent/ClientTimeline";
import ClientEdit from "./ClientEdit";
import { roleGroups } from "/imports/api/users/enums/roles";

export default class ClientContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
  }

  componentWillReceiveProps() {
    // this.setState({ edit: false });
  }

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { client, setClient } = this.props;
    const { edit } = this.state;
    return (
      <div className="main-content client-content">
        {edit ? (
          <ClientEdit setEdit={this.setEdit} client={client} />
        ) : (
          <div>
            <ClientContentHeader
              setClient={setClient}
              setEdit={this.setEdit}
              client={client}
            />
            <ContactBlock client={client} />
            {Roles.userIsInRole(
              Meteor.userId(),
              roleGroups.ADMIN_TECH_MANAGER
            ) && <ClientTimeline client={client} />}
          </div>
        )}
      </div>
    );
  }
}
