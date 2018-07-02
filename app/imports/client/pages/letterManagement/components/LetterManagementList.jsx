import React, { Component } from "react";
import LetterManagementSingle from "./LetterManagementSingle";


export default class LetterManagementList extends Component {
  
  render() {
    const { letters } = this.props;
    const letterList = letters.map(function(letter, index) {
      return <LetterManagementSingle key={letter._id} letter={letter} />;
    }, this);

    return <div className="task-list">{letterList}</div>;
  }
}
