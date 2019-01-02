import React, { Component } from "react";
import ClientContentHeader from "./components/ClientContent/ClientContentHeader";
import ContactBlock from "./components/ClientContent/ContactBlock";
import ClientTimeline from "./components/ClientContent/ClientTimeline";
import ClientEdit from "./ClientEdit";
import { roleGroups } from "/imports/api/users/enums/roles";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class ClientContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      clientId: this.props.currentClient,
      client: null
    };

    this.pollingMethod = null;
  }

  componentWillMount() {
    this.getClient();

    this.pollingMethod = setInterval(() => {
      this.getClient();
    }, 10000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentClient === this.props.currentClient) return;

    this.setState({ clientId: nextProps.currentClient, client: null });
    this.getClient(nextProps.currentClient);
  }

  componentWillUnmount() {
    clearInterval(this.pollingMethod);
  }

  getClient(clientId) {
    const currentClient = clientId || this.state.clientId;
    Meteor.call("client.getOne", currentClient, (err, client) => {
      if (!err) {
        this.setState({ client });
      } else {
        Notifier.error(err.reason);
      }
    });
  }

  setEdit = () => {
    this.setState({ edit: !this.state.edit });
  };

  render() {
    if (!this.state.client) {
      return <Loading />;
    }

    return (
      <div className="main-content client-content">
        {this.state.edit ? (
          <ClientEdit setEdit={this.setEdit} client={this.state.client} />
        ) : (
          <div>
            <ClientContentHeader
              setClient={this.props.setClient}
              setEdit={this.setEdit}
              client={this.state.client}
            />
            <ContactBlock client={this.state.client} />

            {Roles.userIsInRole(
              Meteor.userId(),
              roleGroups.ADMIN_TECH_MANAGER
            ) && <ClientTimeline clientId={this.state.client._id} />}
          </div>
        )}
      </div>
    );
  }
}
