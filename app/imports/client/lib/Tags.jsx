import React, { Component } from "react";
import classNames from "classnames";

export default class TagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenedDropdown: false,
      selectedTags: []
    };
  }

  componentWillMount() {
    const selectedTags = FlowRouter.getQueryParam("tagIds") || [];
    this.setState({ selectedTags });
  }

  componentWillUnmount () {
    document.removeEventListener ('click', this.outsideClick, false);
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

  openDropdown = () => {
    const {isOpenedDropdown} = this.state;

    if (!isOpenedDropdown) {
      document.addEventListener("click", this.outsideClick, false);
    } else {
      document.removeEventListener("click", this.outsideClick, false);
    }

    this.setState({
      isOpenedDropdown: !isOpenedDropdown
    })
  };

  outsideClick = e => {
    if (this.node.contains(e.target)) {
      return;
    }

    this.openDropdown();
  };

  nodeRef = node => {
    this.node = node;
  };

  render() {
    const { tags } = this.props;
    const { selectedTags, isOpenedDropdown } = this.state;
    const btnToggleClasses = classNames('js-toggle-dropdown', {
      'active': isOpenedDropdown
    });

    return (
      <div className="tag-dropdown">
        <button className={btnToggleClasses} onClick={this.openDropdown}>
          <i className="icon-tag"/>
        </button>
        {
          isOpenedDropdown && (
            <div className="tag-dropdown__container" ref={this.nodeRef}>
              <div className="tag-caret">
                <div className="tag-caret__outer"/>
                <div className="tag-caret__inner"/>
              </div>
              <ul className="tag-list">
                {tags.map((tag, index) => {
                  const { _id, name } = tag;
                  const tagClass = classNames('tag-item', {
                    "tag-item__active": selectedTags.includes(_id)
                  });

                  return (
                    <li className={tagClass} key={index}>
                      <a href="javascript:;" onClick={this.onSwitchTags.bind(this, _id)}>{name}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}
