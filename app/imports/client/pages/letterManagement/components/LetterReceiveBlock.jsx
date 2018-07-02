import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import { getToken } from "/imports/api/s3-uploads/utils";
import DropzoneComponent from "react-dropzone-component";

export default class LetterReceiveBlock extends Component {
  render() {
    const { facility } = this.props;
    const componentConfig = {
      postUrl: `/uploads/letter-receive/${getToken()}`
    };

    const djsConfig = {
      complete(file) {
        Notifier.success("Added");
        this.removeFile(file);
      },
      acceptedFiles: ".csv"
    };
    return (
      <div>
        <div className="action-block drop-file">
          <div className="header__block">
            <div className="title-block text-uppercase">Home File</div>
          </div>
          <div className="main__block">
            <div className="add-content">
              <i className="icon-upload" />
            </div>
            <div className="upload-list">
              <DropzoneComponent
                config={componentConfig}
                djsConfig={djsConfig}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
