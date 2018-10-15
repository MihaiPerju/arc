import React, { Component } from "react";
import { getImagePath } from "../../../../api/utils";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import { moduleNames } from "/imports/api/tags/enums/tags";
export default class ClientSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontNormal: false,
      bgYellow: false
    };
    this.changeTaskBg = this.changeTaskBg.bind(this);
  }

  onSetClient() {
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
    const { id, mail, avatar, name, currentClient, tags, client } = this.props;
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
        </div>
        <div className="row__item margin-top-10">
          <div className="info">
            <div className="person-name">{name}</div>
            <div className="row__item margin-top-10">
              <div className="item-name text-blue">{mail}</div>
            </div>
            <div className="row__item margin-top-10">
              <TagItem
                title="Tag Client"
                tagIds={client.tagIds}
                tags={tags}
                onSubmitTags={this.onSubmitTags.bind(this)}
                entityName={moduleNames.CLIENTS}
              />
            </div>
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
