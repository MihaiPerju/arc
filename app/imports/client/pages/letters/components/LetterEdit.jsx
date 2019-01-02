import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class LetterEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  editLetter = () => {
    this.setState({ loading: true });
    const {
      letterBody,
      accountId,
      reset,
      selectedAttachments,
      letterTemplateId,
      selectedLetterId,
      keywordsValues
    } = this.props;
    const attachmentIds = this.getAttachmentIds(selectedAttachments);

    const data = {
      body: letterBody,
      accountId,
      attachmentIds,
      letterTemplateId,
      letterValues: keywordsValues
    };

    Meteor.call("letter.update", selectedLetterId, data, err => {
      if (err) {
        Notifier.error(err.reason);
      } else {
        Notifier.success("Letter successfully updated !");
        reset();
      }
      this.setState({ loading: false });
    });
  };

  getAttachmentIds = attachments => {
    let attachmentIds = [];
    for (let attachment of attachments) {
      attachmentIds.push(attachment._id);
    }
    return attachmentIds;
  };

  doCheck = () => {
    const { keywordsValues } = this.props;
    for (let key in keywordsValues) {
      if (!keywordsValues[key]) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { hasKeywords } = this.props;
    const { loading } = this.state;
    let isDisabled = hasKeywords ? this.doCheck() : false;
    if (loading) {
      return <Loading />;
    }
    return (
      <button
        style={isDisabled ? { cursor: "not-allowed" } : {}}
        disabled={isDisabled}
        onClick={this.editLetter}
        className="btn--green btn-save"
      >
        Update
      </button>
    );
  }
}
