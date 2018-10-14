import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import { moduleNames }  from '/imports/client/pages/tags/enums/moduleList'
export default class LetterTemplateSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogIsActive: false
    };
  }

  onSetTemplate() {
    const { template, setTemplate } = this.props;
    setTemplate(template._id);
  }

  onSelectTemplate(e) {
    e.stopPropagation();
    const { template, selectTemplate } = this.props;
    selectTemplate(template._id);
  }

  onSubmitTags = data => {
    const { _id } = this.props.template;
    Object.assign(data, { _id });

    Meteor.call("letterTemplate.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const {
      template,
      templatesSelected,
      currentTemplate,
      tags
    } = this.props;
    const checked = templatesSelected.includes(template._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentTemplate === template._id
    });

    return (
      <div onClick={this.onSetTemplate.bind(this)} className={classes}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectTemplate.bind(this)} />
        </div>
        <div className="row__item margin-top-10">
          <div className="item-name">{template.name}</div>
        </div>
        <div className="row__item margin-top-10">
          <TagItem
            title="Tag templates"
            tagIds={template.tagIds}
            tags={tags}
            onSubmitTags={this.onSubmitTags.bind(this)}
            entityName={moduleNames.TEMPLATES}
          />
        </div>
      </div>
    );
  }
}
