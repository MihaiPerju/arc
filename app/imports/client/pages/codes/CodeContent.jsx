import React, { Component } from "react";
import CodeHeader from "./components/CodeContent/CodeHeader";
import DescriptionBlock from "./components/CodeContent/DescriptionBlock";
import ActionBlock from "./components/CodeContent/ActionBlock";
import CodeEdit from "./CodeEdit";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class CodeContent extends Component {
  constructor() {
    super();
    this.state = {
      edit: false
    };
    this.pollingMethod = null;
  }

  componentWillMount() {
    this.pollingMethod = setInterval(() => {
      this.getCode();
    }, 3000);
  }

  getCode() {
    const { currentCode } = this.props;
    Meteor.call("code.getOne", currentCode, (err, code) => {
      if (!err) {
        this.setState({ code });
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
    const { edit, code } = this.state;

    if (!code) {
      return <Loading />;
    }

    return (
      <div className="main-content code-content">
        {edit ? (
          <CodeEdit setEdit={this.setEdit} code={code} />
        ) : (
          <div>
            <CodeHeader setEdit={this.setEdit} code={code} />
            <DescriptionBlock code={code} />
            <ActionBlock code={code} />
          </div>
        )}
      </div>
    );
  }
}
