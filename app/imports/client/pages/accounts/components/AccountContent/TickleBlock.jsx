import React, { Component } from "react";
import moment from "moment/moment";
import query from "/imports/api/tickles/queries/tickleList";

export default class TickleBlock extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentWillMount() {
    const { accountId } = this.props;
    this.fetchMessages(accountId);
  }

  componentWillReceiveProps(props) {
    const { accountId } = props;
    this.fetchMessages(accountId);
  }

  fetchMessages = accountId => {
    query.clone({ filters: { accountId } }).fetchOne((err, data) => {
      if (!err) {
        const messages = data ? data.messages : [];
        this.setState({
          messages
        });
      }
    });
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="action-block">
        <div className="header__block">
          <div className="title-block text-uppercase">Tickle reason</div>
        </div>
        <div className="comment-list">
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className="comment-item flex--helper flex--column"
              >
                <div className="comment__wrapper flex--helper flex-justify--space-between">
                  <div className="name truncate">{message.userName}</div>
                  <div className="time">
                    {moment(message.createdAt).format("MMMM Do YYYY, hh:mm a")}
                  </div>
                </div>
                <div className="message text-light-grey">
                  <b>Tickle date: </b>
                  {moment(message.tickleDate).format("MMMM Do YYYY, hh:mm a")}
                </div>
                <div className="message text-light-grey">
                  <b>Tickle reason: </b>
                  {message.reason}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
