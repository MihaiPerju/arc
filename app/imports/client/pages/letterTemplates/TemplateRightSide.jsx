import React, { Component } from "react";
import LetterTemplateContent from "./LetterTemplateContent.jsx";
import LetterTemplateCreate from "./LetterTemplateCreate.jsx";

export default class RightSide extends Component {
  constructor() {
    super();
    this.state = {
      fade: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fade: true });
    }, 300);
  }

  render() {
    const { fade } = this.state;
    const { currentTemplate, create, close } = this.props;
    return (
      <div className={fade ? "right__side in" : "right__side"}>
        {create ? (
          <LetterTemplateCreate close={close} />
        ) : (
          <LetterTemplateContent currentTemplate={currentTemplate} />
        )}
      </div>
    );
  }
}
