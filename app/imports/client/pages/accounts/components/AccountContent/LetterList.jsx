import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import NewLetter from "./NewLetter";
import EditLetter from "./EditLetter";
import { getToken } from "/imports/api/uploads/utils";
import Notifier from "/imports/client/lib/Notifier";
import Statuses from "/imports/api/letters/enums/statuses.js";
import Loading from "/imports/client/lib/ui/Loading";

export default class LetterList extends Component {
  constructor() {
    super();
    this.state = {
      createLetter: false,
      editLetter: false,
      selectedLetter: null,
      letterTemplates: [],
      loadingLetterTemplates: true,
      deletingLetterId: null
    };
  }

  componentWillMount() {
    Meteor.call("letterTemplates.get", (err, letterTemplates) => {
      if (!err) {
        this.setState({
          letterTemplates,
          loadingLetterTemplates: false
        });
      }
    });
  }

  toggleLetter = () => {
    this.setState({
      createLetter: !this.state.createLetter,
      editLetter: false
    });
  };

  handleDelete = letterId => {
    this.setState({ deletingLetterId: letterId });
    Meteor.call("letter.delete", letterId, err => {
      if (err) {
        return Notifier.error(err.reason);
      } else {
        Notifier.success("Letter deleted!");
      }
    });
  };

  toggleEditLetter = () => {
    this.setState({
      editLetter: !this.state.editLetter,
      createLetter: false
    });
  };

  resetForm = () => {
    this.setState({
      editLetter: false,
      createLetter: false
    });
  };

  redirectToPdf(pdf) {
    window.open("/letters/pdf/" + pdf, "_blank");
  }

  handleEdit = letter => {
    const { editLetter } = this.state;
    this.setState({ selectedLetter: letter });
    if (!editLetter) {
      this.toggleEditLetter();
    }
  };

  extendFields(account) {
    if (account) {
      if (account.facility) {
        account.FacilityAddress = account.facility.addressOne || null;
        account.FacilityAddress2 = account.facility.addressTwo || null;
        account.FacilityZip = account.facility.zipCode || null;
        account.FacilityCity = account.facility.city || null;
        account.FacilityState = account.facility.state || null;
      }

      if (account.client && account.client.clientName) {
        account.clientName = account.client.clientName;
      }
      if (account.facility && account.facility.name) {
        account.facilityName = account.facility.name;
      }
    }
  }

  onMarkManuallyMailed = _id => {
    Meteor.call("letter.updateStatus", _id, Statuses.MANUALLY_MAILED, err => {
      if (!err) {
        Notifier.success("Letter is manually mailed");
      } else {
        Notifier.error(err.reason);
      }
    });
  };

  render() {
    const { account } = this.props;
    this.extendFields(account);
    const {
      editLetter,
      selectedLetter,
      letterTemplates,
      createLetter,
      deletingLetterId
    } = this.state;

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Letter list</div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.toggleLetter}>
            <i className="icon-envelope-o" />
            <div className="text-center">+ Create a new letter</div>
          </div>
          {createLetter ? (
            <NewLetter
              letterTemplates={letterTemplates}
              cancel={this.resetForm}
              account={account}
            />
          ) : null}

          {editLetter ? (
            <EditLetter
              letterTemplates={letterTemplates}
              selectedLetter={selectedLetter}
              cancelEdit={this.resetForm}
              account={account}
            />
          ) : null}

          <div className="block-list letter-list">
            {account &&
              account.letters &&
              _.map(account.letters, (letter, index) => {
                return (
                  <div
                    key={index}
                    className="block-item flex--helper flex-justify--space-between"
                  >
                    <div className="info">
                      <div className="title truncate">Letter {index}</div>
                    </div>
                    <div className="status pending">{letter.status}</div>
                    <div className="btn-group flex--helper flex-justify--end">
                      {letter.status === Statuses.NEW && (
                        <button
                          onClick={() => this.onMarkManuallyMailed(letter._id)}
                        >
                          Mark Manually Mailed
                        </button>
                      )}
                      {letter.status === Statuses.NEW && (
                        <button
                          className="btn-text--green"
                          onClick={() => this.handleEdit(letter)}
                        >
                          <i className="icon-pencil" />
                        </button>
                      )}
                      <button
                        className="btn-text--blue"
                        onClick={this.redirectToPdf.bind(
                          this,
                          `${account._id}/${letter._id}/${getToken()}`
                        )}
                      >
                        <i className="icon-download" />
                      </button>
                      {deletingLetterId == letter._id ? (
                        <Loading />
                      ) : (
                        letter.status === Statuses.NEW && (
                          <button
                            className="btn-text--red"
                            onClick={() => this.handleDelete(letter._id)}
                          >
                            <i className="icon-trash-o" />
                          </button>
                        )
                      )}

                      <LetterPreview id={letter._id} body={letter.body} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

class LetterPreview extends Component {
  constructor() {
    super();
    this.state = {
      dialogIsActive: false
    };
  }

  openDialog = () => {
    this.setState({
      dialogIsActive: true
    });
  };

  closeDialog = () => {
    this.setState({
      dialogIsActive: false
    });
  };

  render() {
    const { dialogIsActive } = this.state;
    const { id, body } = this.props;

    return (
      <button className="btn--blue" onClick={this.openDialog}>
        <span>View</span>
        {dialogIsActive && (
          <Dialog
            className="letter-dialog"
            closePortal={this.closeDialog}
            title={""}
          >
            <div className="text-light-grey id-num">Letter ID: {id}</div>
            <div
              className="letter-content"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            <div className="btn-group">
              <button className="btn--pink" onClick={this.closeDialog}>
                Close
              </button>
            </div>
          </Dialog>
        )}
      </button>
    );
  }
}
