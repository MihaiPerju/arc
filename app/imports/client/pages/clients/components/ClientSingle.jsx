import React, { Component } from "react";
import { getImagePath } from "../../../../api/utils";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";

export default class ClientSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontNormal: false,
      bgYellow: false
    };
    this.changeTaskBg = this.changeTaskBg.bind(this);
  }

  onSetClient(_id) {
    const { id, setClient } = this.props;
    this.setState({
      fontNormal: true
    });
    setClient(id);
  }

  changeTaskBg() {
    this.setState({
      bgYellow: !this.state.bgYellow
    });
    this.props.showBtnGroup();
  }

  onSelectClient(e) {
    const { selectClient, id } = this.props;
    const { bgYellow } = this.state;

    this.setState({
      bgYellow: !bgYellow
    });
    selectClient(id);
    e.stopPropagation();
  }

  onSubmitTags = data => {
    const { _id } = this.props.client;
    Object.assign(data, { _id });

    Meteor.call("client.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { bgYellow } = this.state;
    const {
      id,
      mail,
      avatar,
      name,
      currentClient,
      moduleTags,
      client
    } = this.props;
    const classes = classNames({
      "list-item": true,
      "user-item": true,
      "bg--yellow": bgYellow,
      open: currentClient === id
    });

    return (
      <div className={classes} onClick={this.onSetClient.bind(this)}>
        <div className="check-item">
          <input checked={bgYellow} type="checkbox" className="hidden" />
          <label onClick={this.onSelectClient.bind(this)} />
          <TagItem
            title="Tag Client"
            tagIds={client.tagIds}
            moduleTags={moduleTags}
            onSubmitTags={this.onSubmitTags.bind(this)}
          />
        </div>
        <div className="row__block align-center">
          <div className="info">
            <div className="person-name">{name}</div>
            <div className="item-name text-blue">{mail}</div>
          </div>
          <img
            className="md-avatar img-circle"
            src={avatar ? getImagePath(avatar) : "/assets/img/user.svg"}
          />
        </div>
      </div>
    );
  }
}
