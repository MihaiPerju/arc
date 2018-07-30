import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import { getToken } from "../../../../../api/s3-uploads/utils";
import Notifier from "../../../../lib/Notifier";
import ReactHover from "react-hover";
export default class ActionBlock extends Component {
  constructor() {
    super();

    this.state = {
      isUploading: false,
      numPages: null,
      pageNumber: 1,
      pdfIndex: null
    };
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

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

  reviewPdf(index) {
    const { pdfIndex } = this.state;
    if (index === pdfIndex) {
      this.setState({
        pdfIndex: null
      });
    } else {
      this.setState({
        pdfIndex: index
      });
    }
  }

  render() {
    const { account } = this.props;
    const { pageNumber, numPages, pdfIndex } = this.state;
    const accountId = account && account._id;
    const componentConfig = {
      postUrl: `/uploads/account-pdf/` + accountId + "/" + getToken()
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
          </div>
          <div className="block-list file-list pdf-container">
            {account &&
              account.attachments &&
              account.attachments.map((pdf, index) => {
                return (
                  <ReactHover options={options} key={index}>
                    <ReactHover.Trigger type="trigger">
                      {pdf && (
                        <div className="block-item flex--helper flex-justify--space-between">
                          <div className="info flex--helper">
                            <div className="title truncate">
                              {this.getPdfName(pdf)}
                            </div>
                          </div>
                          <div className="btn-group flex--helper">
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
                            <button
                              onClick={this.reviewPdf.bind(this, index)}
                              className="btn-text--blue"
                            >
                              {index === pdfIndex ? (
                                <i className="icon-close" />
                              ) : (
                                <i className="icon-view" />
                              )}
                            </button>
                          </div>
                          {index === pdfIndex && (
                            <object
                              className="pdf-preview"
                              data={"/pdf/" + pdf._id + "/" + getToken()}
                              width={430}
                              height={350}
                            />
                          )}
                        </div>
                      )}
                    </ReactHover.Trigger>
                    <ReactHover.Hover type="hover" />
                  </ReactHover>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
