import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";

export default class FileSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetFile() {
    const { file, setFile } = this.props;
    setFile(file._id);
  }

  onSelectFile(e) {
    e.stopPropagation();
    const { file, selectFile } = this.props;
    selectFile(file._id);
  }

  onSubmitTags = data => {
    const { _id } = this.props.file;
    Object.assign(data, { _id });

    Meteor.call("file.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  getFileName = name => {
    return name.split(".")[0] || "";
  };

  render() {
    const { file, filesSelected, currentFile } = this.props;
    const checked = filesSelected.includes(file._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentFile === file._id
    });

    return (
      <div className={classes} onClick={this.onSetFile.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectFile.bind(this)} />
        </div>
        <div className="row__block align-center">
          <div className="item-name">{this.getFileName(file.fileName)}</div>
        </div>
      </div>
    );
  }
}
