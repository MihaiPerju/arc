import React, { Component } from "react";
import ModuleTagSingle from "./ModuleTagSingle";

export default class ModuleTagList extends Component {
  render() {
    const { tags } = this.props;
    const tagList = tags.map(function(tag, index) {
      const { setTag, selectTag, tagsSelected, currentTag } = this.props;
      return (
        <ModuleTagSingle
          tagsSelected={tagsSelected}
          currentTag={currentTag}
          selectTag={selectTag}
          setTag={setTag}
          tag={tag}
          key={tag._id}
        />
      );
    }, this);
    return <div className={this.props.class}>{tagList}</div>;
  }
}
