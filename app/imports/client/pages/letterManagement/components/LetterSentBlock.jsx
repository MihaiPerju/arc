import React, { Component } from "react";
import Notifier from "/imports/client/lib/Notifier";
import { getToken } from "/imports/api/s3-uploads/utils";
import DropzoneComponent from "react-dropzone-component";

export default class LetterSentBlock extends Component {
  render() {
    const componentConfig = {
      postUrl: `/uploads/letter-sent/${getToken()}`
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
        <div className="action-block drop-file m-t--20">
          <div className="header__block">
            <div className="title-block text-uppercase">Process File</div>
          </div>
          <div className="main__block">
            <div className="btn-group-1">
              <div className="add-content">
                <i className="icon-upload" />
                <div className="drop-file__wrapper">
                  <DropzoneComponent
                    config={componentConfig}
                    djsConfig={djsConfig}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
