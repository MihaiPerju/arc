import React, { Component } from "react";
import LetterManagementSingle from "./LetterManagementSingle";
import letterTemplateQuery from "/imports/api/letterTemplates/queries/listLetterTemplates";

export default class LetterManagementList extends Component {
  constructor() {
    super();
    this.state = {
      letterTemplates: []
    };
  }
  componentWillMount() {
    letterTemplateQuery.fetch((err, letterTemplates) => {
      if (!err) {
        this.setState({
          letterTemplates
        });
      }
    });
  }
  getOptions = (letterTemplates) => {
    return letterTemplates.map(letterTemplate => 
      letterTemplate.name
    )
  };
  render() {
    const { letters } = this.props;
    const options = this.getOptions(this.state.letterTemplates)
    const letterList = letters.map(function(letter, index) {
      return <LetterManagementSingle key={letter._id} letter={letter} letterName={options[index]}/>;
    }, this);

    return <div className="task-list">{letterList}</div>;
  }
}
