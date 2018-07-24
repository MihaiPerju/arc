import React, { Component } from "react";
import classNames from "classnames";

export default class TagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: []
    };
  }

  componentWillMount() {
    const selectedTags = FlowRouter.getQueryParam("tagIds") || [];
    this.setState({ selectedTags });
  }

  componentWillReceiveProps() {
    if (!FlowRouter.getQueryParam("tagIds")) {
      this.setState({ selectedTags: [] });
    }
  }

  onSwitchTags = id => {
    const { selectedTags } = this.state;
    const index = selectedTags.indexOf(id);
    if (index === -1) {
      selectedTags.push(id);
    } else {
      selectedTags.splice(index, 1);
    }
    this.setState({ selectedTags });
    FlowRouter.setQueryParams({ tagIds: selectedTags });
  };

  render() {
    const { moduleTags } = this.props;
    const { selectedTags } = this.state;

    return (
      <div>
        {moduleTags.map((tag, index) => {
          const { _id, name } = tag;
          const tagClass = classNames({
            "btn--red": selectedTags.includes(_id),
            "btn--light-blue": !selectedTags.includes(_id)
          });
          return (
            <button
              key={index}
              className={tagClass}
              style={{ margin: "7px 6px 7px 0px", borderRadius: "25px" }}
              onClick={this.onSwitchTags.bind(this, _id)}
            >
              {name}
            </button>
          );
        })}
      </div>
    );
  }
}
