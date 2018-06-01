import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "../../../../../api/s3-uploads/utils";
import Notifier from "../../../../lib/Notifier";
import ReactHover from "react-hover";
export default class ActionBlock extends Component {
  constructor() {
    super();

    this.state = {
      isUploading: false
    };
  }

  downloadPdfs() {
    const { account } = this.props;
    const { items } = this.child.state;

    //creating attachmentIds
    let attachmentIds = [];

    for (item of items) {
      attachmentIds.push(item._id);
    }

    //Updating status in Db
    Meteor.call(
      "account.attachment.update_order",
      account._id,
      attachmentIds,
      err => {
        if (!err) {
          window.open("/pdfs/" + account._id + "/" + getToken(), "_blank");
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  }
  getPdfName(pdf) {
    return pdf.name.slice(0, pdf.name.indexOf("."));
  }

  redirectToPdf = pdf => {
    window.open("/pdf/" + pdf._id + "/" + getToken(), "_blank");
  };

  deletePdf = pdf => {
    const accountId = FlowRouter.current().params._id;

    Meteor.call(
      "account.attachment.remove",
      accountId,
      pdf._id,
      pdf.path,
      err => {
        if (!err) {
          Notifier.success("Attachment removed!");
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  };

  render() {
    const { account } = this.props;

    const componentConfig = {
      postUrl: `/uploads/account-pdf/` + account._id + "/" + getToken()
    };
    const that = this;
    const djsConfig = {
      complete(file) {
        Notifier.success("Added");
        this.removeFile(file);
      },
      acceptedFiles: ".pdf"
    };
    const options = {
      followCursor: true,
      shiftX: 20,
      shiftY: 0
    };

    return (
      <div className="action-block drop-file">
        <div className="header__block">
          <div className="title-block text-uppercase">pdf files</div>
        </div>
        <div className="main__block">
          <div className="btn-group-1">
            <div className="add-content">
              <i className="icon-file-pdf-o" />
              <div className="drop-file__wrapper">
                <DropzoneComponent
                  config={componentConfig}
                  djsConfig={djsConfig}
                />
              </div>
            </div>
            {account.attachments &&
              account.attachments.length > 1 && (
                <button
                  onClick={this.downloadPdfs.bind(this)}
                  className="btn-download"
                >
                  <span className="text-dark-grey">Download all</span>
                </button>
              )}
          </div>
          <div className="block-list file-list">
            {account.attachments &&
              account.attachments.map((pdf, index) => {
                return (
                  <ReactHover options={options} key={index}>
                    <ReactHover.Trigger type="trigger">
                      <div style={{ listStyleType: "none" }}>
                        {pdf && (
                          <div className="block-item flex--helper flex-justify--space-between">
                            <div className="info flex--helper">
                              <div className="title truncate">
                                {this.getPdfName(pdf)}
                              </div>
                            </div>
                            <div className="btn-group">
                              <button
                                onClick={this.redirectToPdf.bind(this, pdf)}
                                className="btn-text--blue"
                              >
                                <i className="icon-download" />
                              </button>
                              <button
                                onClick={this.deletePdf.bind(this, pdf)}
                                className="btn-text--red"
                              >
                                <i className="icon-trash-o" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </ReactHover.Trigger>
                    <ReactHover.Hover type="hover">
                      {this.getPdfName(pdf)}
                    </ReactHover.Hover>
                  </ReactHover>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
