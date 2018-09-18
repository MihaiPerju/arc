import React, { Component } from "react";
import classNames from "classnames";

export default class ModuleTagSingle extends Component {
  constructor(props) {
    super(props);
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

  renderTag(moduleName) {
    return (
      <div className="tag-item">
        {moduleName}
      </div>
    );
  }

  render() {
    const { tag, tagsSelected, currentTag } = this.props;
    const checked = tagsSelected.includes(tag._id);
    const classes = classNames({
      "list-item": true,
      "bg--yellow": checked,
      open: currentTag === tag._id
    });
    console.log(tag);
    console.log(tagsSelected);
    console.log(currentTag);
    return (
      <div className={classes} onClick={this.onSetTag.bind(this)}>
        <div className="check-item">
          <input checked={checked} type="checkbox" className="hidden" />
          <label onClick={this.onSelectTag.bind(this)} />
        </div>
        <div className="row-item">
          <div className="item-name">{tag.name}</div>

        </div>
        <div className="row-item m-t--10">
          <div className="tag-inner-div">
            <div className="menu__icon"><i className="icon-tags tags-icon"></i></div>
          </div>
          <div className="tag-inner-div">
            {
              tag.moduleNames.length > 0 ?
                tag.moduleNames.map(name => this.renderTag(name)) :
                <label className="no-tags-found">No tag modules found.</label>
            }
          </div>
        </div>
      </div>
    );
  }
}
