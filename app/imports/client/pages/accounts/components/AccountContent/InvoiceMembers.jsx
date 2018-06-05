import React, { Component } from "react";

export default class InvoiceMembers extends Component {
  render() {
    const { account } = this.props;

    return (
      <div className="invoice-section">
        <div className="left--side">
          <div className="text-light-grey">Invoice numbers</div>
        </div>
        <div className="right--side">
          <ul className="invoice-list">
            {account.invoiceNo &&
              account.invoiceNo.map(function(invoice, index) {
                return <li key={index}>{invoice}</li>;
              })}
          </ul>
        </div>
      </div>
    );
  }
}
