import React, { Component } from "react";
import ClientSingle from "./ClientSingle";

export default class ClientList extends Component {
  render() {
    const {
      clients,
      currentClient,
      renderContent,
      selectClient,
      setClient,
      tags
    } = this.props;
    const clientList = clients.map(function(client) {
      return (
        <ClientSingle
          currentClient={currentClient}
          renderContent={renderContent}
          selectClient={selectClient}
          name={client.clientName}
          avatar={client.logoPath}
          setClient={setClient}
          mail={client.email}
          id={client._id}
          key={client._id}
          tags={tags}
          client={client}
        />
      );
    }, this);
    return <div className={this.props.class}>{clientList}</div>;
  }
}
