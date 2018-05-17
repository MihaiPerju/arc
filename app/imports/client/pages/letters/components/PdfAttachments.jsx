import React, { Component } from "react";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import AccountViewService from "/imports/client/pages/accounts/services/AccountViewService";

export default class PdfAttachments extends Component {
  render() {
    const { attachments, onRemoveAttachment, onOrderChange } = this.props;
    return (
      <div className="attachment-list">
        <SortableComponent
          onRemoveAttachment={onRemoveAttachment}
          onOrderChange={onOrderChange}
          items={attachments}
        />
      </div>
    );
  }
}

const SortableItem = SortableElement(({ item, onRemoveAttachment }) => {
  remove = () => {
    onRemoveAttachment(item._id);
  };

  return (
    <div className="attachment-item">
      <span className="text-white truncate">
        {AccountViewService.getPdfName(item)}
      </span>
      <div className="btn-rmv">
        <a className="icon-trash-o" onClick={this.remove.bind(this)} />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ items, onRemoveAttachment }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <SortableItem
          onRemoveAttachment={onRemoveAttachment}
          key={item._id}
          index={index}
          item={item}
        />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  state = {
    items: this.props.items
  };
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    });
    this.props.onOrderChange(this.state.items);
  };
  render() {
    return (
      <SortableList
        onRemoveAttachment={this.props.onRemoveAttachment}
        items={this.state.items}
        onSortEnd={this.onSortEnd}
        distance={10}
      />
    );
  }
}
