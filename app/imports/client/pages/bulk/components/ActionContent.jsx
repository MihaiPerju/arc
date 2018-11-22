import React, { Component } from "react";
import pages from "../enums/pages";
import AssignByUser from './AssignByUser';
import AssignByWorkQueue from './AssignByWorkQueue';
import AssignAction from './AssignAction';
import Loading from "/imports/client/lib/ui/Loading";

export default class ActionContent extends Component {
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
        { page === pages.ASSIGN_USER && <AssignByUser onClose={this.props.onClose} /> }
        { page === pages.ASSIGN_WORKQUEUE && <AssignByWorkQueue onClose={this.props.onClose} /> }
        { page === pages.ASSIGN_ACTION && <AssignAction onClose={this.props.onClose} /> }
      </div>
    );
  }
}
