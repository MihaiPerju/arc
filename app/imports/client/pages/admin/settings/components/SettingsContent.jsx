import React, { Component } from "react";
import Root from "./Root";
import LetterDirectory from "./LetterDirectory";
import SMTP from "./SMTP";
import CompileTime from "./CompileTime";
import Thresholds from "./Thresholds";
import pages from "/imports/api/settings/enums/settings";
import Loading from "/imports/client/lib/ui/Loading";

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
        {page === pages.ROOT && <Root onClose={this.props.onClose} />}
        {page === pages.LETTERS_DIRECTORY && <LetterDirectory onClose={this.props.onClose} />}
        {page === pages.COMPILE_TIME && <CompileTime onClose={this.props.onClose}/>}
        {page === pages.SMTP && <SMTP onClose={this.props.onClose}/>}
        {page === pages.THRESHOLDS && <Thresholds onClose={this.props.onClose}/>}
      </div>
    );
  }
}
