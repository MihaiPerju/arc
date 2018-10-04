import React, { Component } from "react";
import LetterSingle from "./LetterSingle";

export default class LetterList extends Component {
  render() {
    const { letters, moduleTags } = this.props;
    const letterList = letters.map(function(letter) {
      return (
        <LetterSingle
          key={letter._id}
          letter={letter}
          moduleTags={moduleTags}
        />
      );
    }, this);

    return <div className="task-list letters">{letterList}</div>;
  }
}
