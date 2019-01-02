import React from "react";
import Notifier from "/imports/client/lib/Notifier";
import Loading from "/imports/client/lib/ui/Loading";

export default class CreateLetter extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  createLetter = () => {
    this.setState({ loading: true });
    const {
      letterBody,
      accountId,
      reset,
      selectedAttachments,
      letterTemplateId,
      letterTemplateName,
      keywordsValues
    } = this.props;
    const attachmentIds = this.getAttachmentIds(selectedAttachments);

    const data = {
      body: letterBody,
      accountId,
      attachmentIds,
      letterTemplateId,
      letterTemplateName,
      letterValues: keywordsValues
    };
    Meteor.call("letter.create", data, err => {
      if (err) {
        Notifier.error("Error while trying to create letter!");
      } else {
        Notifier.success("Letter successfully created!");
        reset();
      }
      this.setState({ loading: false });
    });
  };

  getAttachmentIds(attachments) {
    let attachmentIds = [];
    for (let attachment of attachments) {
      attachmentIds.push(attachment._id);
    }
    return attachmentIds;
  }

  render() {
    const { isCompleted } = this.props;
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (!isCompleted) {
      return <div />;
    }

    return (
      <button onClick={this.createLetter} className="btn--green btn-save">
        Save
      </button>
    );
  }
}
