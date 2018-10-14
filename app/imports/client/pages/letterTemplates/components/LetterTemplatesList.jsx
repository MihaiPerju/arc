import React, { Component } from "react";
import LetterTemplateSingle from "./LetterTemplateSingle";

export default class LetterTemplatesList extends Component {
  render() {
    const { templates, tags } = this.props;
    const letterList = templates.map(function(template) {
      const {
        setTemplate,
        selectTemplate,
        templatesSelected,
        currentTemplate
      } = this.props;
      return (
        <LetterTemplateSingle
          templatesSelected={templatesSelected}
          currentTemplate={currentTemplate}
          selectTemplate={selectTemplate}
          setTemplate={setTemplate}
          template={template}
          key={template._id}
          tags={tags}
        />
      );
    }, this);

    return <div className={this.props.class}>{letterList}</div>;
  }
}
