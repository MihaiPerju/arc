import React, { Component } from "react";
import LetterSentBlock from "./LetterSentBlock";
import LetterReceiveBlock from "./LetterReceiveBlock";

export default class LetterManagementDropzone extends Component {
  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </div>
        <LetterSentBlock />
        <LetterReceiveBlock />
      </div>
    );
  }
}
