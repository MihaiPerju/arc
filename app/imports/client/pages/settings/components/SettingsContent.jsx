import React, { Component } from "react";
import Thresholds from "./Thresholds";
import WidgetSettings from "./WidgetSettings";
import pages from "/imports/api/settings/enums/settings";

export default class SettingsContent extends Component {
  constructor() {
    super();
    this.state = {
      fade: false,
      isDisabled: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { fade } = this.state;
    const { page } = this.props;

    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {page === pages.THRESHOLDS && <Thresholds onClose={this.props.onClose}/>}
        {page === pages.WIDGET_SETTINGS && <WidgetSettings onClose={this.props.onClose}/>}
      </div>
    );
  }
}
