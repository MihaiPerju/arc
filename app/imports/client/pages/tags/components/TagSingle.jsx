import React, { Component } from "react";
import classNames from "classnames";
import Notifier from "/imports/client/lib/Notifier";
import TagItem from "/imports/client/lib/TagItem";

export default class TagSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogIsActive: false
    };
  }

  onSetTag() {
    const { tag, setTag } = this.props;
    setTag(tag._id);
  }

  onSelectTag(e) {
    e.stopPropagation();
    const { tag, selectTag } = this.props;
    selectTag(tag._id);
  }

  onSubmitTags = data => {
    const { _id } = this.props.tag;
    Object.assign(data, { _id });

    Meteor.call("tags.tag", data, err => {
      if (!err) {
        Notifier.success("Tagged successfully");
      } else {
        Notifier.error(err.error);
      }
    });
  };

  render() {
    const { tag, tagsSelected, currentTag, moduleTags } = this.props;
    const checked = tagsSelected.includes(tag._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentTag === tag._id
    });

    return (
      <div className={classes} onClick={this.onSetTag.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectTag.bind(this)} />
          <TagItem
            title="Tag:"
            tagIds={tag.tagIds}
            moduleTags={moduleTags}
            onSubmitTags={this.onSubmitTags.bind(this)}
          />
        </div>
        <div className="row__block align-center">
          <div className="item-name">{tag.name}</div>
        </div>
      </div>
    );
  }
}
