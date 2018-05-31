import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import NewLetter from "./NewLetter";
import EditLetter from "./EditLetter";
import LetterListQuery from "/imports/api/letters/queries/letterList.js";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import Loading from "/imports/client/lib/ui/Loading";
import { getToken } from "/imports/api/s3-uploads/utils";
import letterTemplateQuery from "/imports/api/letterTemplates/queries/listLetterTemplates";
import Notifier from "/imports/client/lib/Notifier";
import Statuses from "/imports/api/letters/enums/statuses.js";
class LetterList extends Component {
  constructor() {
    super();
    this.state = {
      createLetter: false,
      editLetter: false,
      selectedLetter: null,
      letterTemplates: [],
      loadingLetterTemplates: true
    };
  }

  componentWillMount() {
    letterTemplateQuery.fetch((err, letterTemplates) => {
      if (!err) {
        this.setState({
          letterTemplates,
          loadingLetterTemplates: false
        });
      }
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ editLetter: false, createLetter: false });
  }

  toggleLetter() {
    this.setState({
      createLetter: !this.state.createLetter,
      editLetter: false
    });
  }

  toggleEditLetter() {
    this.setState({
      editLetter: !this.state.editLetter,
      createLetter: false
    });
  }

  handleDelete = letterId => {
    Meteor.call("letter.delete", letterId, err => {
      if (err) {
        return Notifier.error("Error while removing letter!");
      }

      Notifier.success("Letter deleted!");
    });
  };

  toggleLetter() {
    this.setState({
      createLetter: !this.state.createLetter,
      editLetter: false
    });
  }

  toggleEditLetter() {
    this.setState({
      editLetter: !this.state.editLetter,
      createLetter: false
    });
  }

  handleDelete = letterId => {
    Meteor.call("letter.delete", letterId, err => {
      if (err) {
        return Notifier.error("Error while removing letter!");
      }

      Notifier.success("Letter deleted!");
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

  render() {
    const { data, isLoading, error, account } = this.props;
    const {
      editLetter,
      selectedLetter,
      letterTemplates,
      createLetter
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <div>Error: {error.reason}</div>;
    }

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Letter list</div>
        </div>
        <div className="main__block">
          <div className="add-content" onClick={this.toggleLetter.bind(this)}>
            <i className="icon-envelope-o" />
            <div className="text-center">+ Create a new letter</div>
          </div>
          {createLetter ? (
            <NewLetter
              letterTemplates={letterTemplates}
              cancel={this.toggleLetter.bind(this)}
              account={account}
            />
          ) : null}

          {editLetter ? (
            <EditLetter
              letterTemplates={letterTemplates}
              selectedLetter={selectedLetter}
              cancelEdit={() => this.toggleEditLetter()}
              account={account}
            />
          ) : null}

          <div className="block-list letter-list">
            {data &&
              _.map(data, (letter, index) => {
                return (
                  <div key={index} className="block-item">
                    <div className="info">
                      <div className="title">Letter {index}</div>
                      <div className="status pending">{letter.status}</div>
                    </div>
                    <div className="btn-group">
                      {letter.status === Statuses.NEW && (
                        <button
                          className="btn-text--blue"
                          onClick={() => this.handleEdit(letter)}
                        >
                          edit
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
                      <button
                        className="btn-text--red"
                        onClick={() => this.handleDelete(letter._id)}
                      >
                        <i className="icon-trash-o" />
                      </button>
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

export default withQuery(
  props => {
    const { account } = props;
    return LetterListQuery.clone({ accountId: account._id });
  },
  { reactive: true }
)(LetterList);

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
