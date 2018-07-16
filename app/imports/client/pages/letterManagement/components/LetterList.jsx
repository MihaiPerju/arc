import React, { Component } from "react";
import LetterSingle from "./LetterSingle";


export default class LetterList extends Component {
  
  render() {
    const { letters } = this.props;
    const letterList = letters.map(function(letter, index) {
      return <LetterSingle key={letter._id} letter={letter} />;
    }, this);

    return <div className="task-list">{letterList}</div>;
  }
}
