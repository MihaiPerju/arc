import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";
import { moduleNames }  from '/imports/client/pages/tags/enums/moduleList'
export default class CodeSingle extends Component {
  constructor(props) {
    super(props);
  }

  onSetCode() {
    const { code, setCode } = this.props;
    setCode(code._id);
  }

  onSelectCode(e) {
    e.stopPropagation();
    const { code, selectCode } = this.props;
    selectCode(code._id);
  }

  onSubmitTags = data => {
    const { _id } = this.props.code;
    Object.assign(data, { _id });

    Meteor.call("code.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { code, codesSelected, currentCode, tags } = this.props;
    const checked = codesSelected.includes(code._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentCode === code._id
    });

    return (
      <div className={classes} onClick={this.onSetCode.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectCode.bind(this)} />
        </div>
        <div className="row__item margin-top-10">
          <div className="item-name">{code.code}</div>
        </div>
        <div className="row__item margin-top-10">
          <TagItem
            title="Tag Code"
            tagIds={code.tagIds}
            tags={tags}
            onSubmitTags={this.onSubmitTags.bind(this)}
            entityName={moduleNames.CODES}
          />
        </div>
      </div>
    );
  }
}
