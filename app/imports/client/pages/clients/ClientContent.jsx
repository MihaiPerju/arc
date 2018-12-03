import React, { Component } from "react";
import ClientContentHeader from "./components/ClientContent/ClientContentHeader";
import ContactBlock from "./components/ClientContent/ContactBlock";
import ClientTimeline from "./components/ClientContent/ClientTimeline";
import ClientEdit from "./ClientEdit";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class ClientContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getClient()

    this.pollingMethod = setInterval(() => {
      this.getClient();
    }, 10000);
  }

  getClient() {
    const { currentClient } = this.props;
    Meteor.call("client.getOne", currentClient, (err, client) => {
      if (!err) {
        this.setState({ client });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  componentWillUnmount = () => {
    //Removing Interval
    clearInterval(this.pollingMethod);
  };

  setEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit });
  };

  render() {
    const { setClient } = this.props;
    const { edit, client } = this.state;

    if (!client) {
      return <Loading />;
    }

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
            ) && <ClientTimeline clientId={client._id} />}
          </div>
        )}
      </div>
    );
  }
}
