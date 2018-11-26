import React, { Component } from "react";
import ClientContent from "../ClientContent.jsx";
import ClientCreate from "../ClientCreate.jsx";

export default class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { currentClient, create, close, setClient } = this.props;
    const { fade } = this.state;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <ClientCreate close={close} />
        ) : (
          <ClientContent setClient={setClient} currentClient={currentClient} />
        )}
      </div>
    );
  }
}
