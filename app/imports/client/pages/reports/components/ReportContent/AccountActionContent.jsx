import React, { Component } from "react";
import moment from "moment";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { accountActionHeader } from "/imports/api/reports/enums/Headers";

export default class AccountActionContent extends Component {
  constructor() {
    super();
  }

  getDataRows = (actionPerformed, columnKey, idx) => {
    if (columnKey === "userId") {
      return (
        <div key={idx}>
          {actionPerformed["user"] &&
            `${actionPerformed["user"].profile.firstName} ${
              actionPerformed["user"].profile.lastName
            }`}
        </div>
      );
    } else if (columnKey === "actionId") {
      return (
        <div key={idx}>
          {actionPerformed["action"] && actionPerformed["action"].title}
        </div>
      );
    } else if (columnKey === "customFields") {
      return (
        <div key={idx}>
          {_.map(actionPerformed[columnKey], (value, key) => {
            if (value) {
              return (
                <div>
                  <b>{key}: </b>
                  <span>
                    {typeof value === "object"
                      ? moment(value).format("MM/DD/YYYY, hh:mm")
                      : value}
                  </span>
                </div>
              );
            }
          })}
        </div>
      );
    } else if (columnKey === "accountId") {
      return (
        <div key={idx}>
          {actionPerformed["account"] && actionPerformed["account"].acctNum}
        </div>
      );
    }
    return (
      <div key={idx}>
        {typeof actionPerformed[columnKey] === "object"
          ? actionPerformed[columnKey] &&
            moment(actionPerformed[columnKey]).format("MM/DD/YYYY, hh:mm")
          : actionPerformed[columnKey]}
      </div>
    );
  };

  getCustomFields() {
    const { accountActions } = this.props;
    let customFieldHeaders = [];
    _.map(accountActions, accountAction => {
      _.map(accountAction.customFields, (value, key) => {
        if (!customFieldHeaders.includes(key)) {
          customFieldHeaders.push(key);
        }
      });
    });
    return customFieldHeaders;
  }

  getCustomFieldValues(customFieldData, header, key) {
    //return <div key={key}>{header} - {key}</div>;
    return <div key={key}>{customFieldData[header] ? customFieldData[header] : ""}</div>;
  }

  render() {
    const { tableHeader, accountActions } = this.props;
    const customFieldHeaders = this.getCustomFields();

    if (accountActions && !accountActions.length) {
      return <div>No Actions</div>;
    }
    return (
      <ScrollSync>
        <div className="table-container flex--helper">
          <ScrollSyncPane>
            <div className="table-container__right">
              <div className="table-row">
                {tableHeader.map((header, index) => {
                  if (
                    header !== "customFields"
                  )
                  return (
                    <div
                      key={index}
                      className="table-header text-center table-field text-light-grey"
                    >
                      <div>
                        {accountActionHeader[header] &&
                          accountActionHeader[header]["label"]}
                      </div>
                    </div>
                  );
                })}
                {tableHeader.includes("customFields") && customFieldHeaders.map((header, index) => {
                  return (
                    <div
                      key={index}
                      className="table-header text-center table-field text-light-grey"
                    >
                      <div>
                        {header}
                      </div>
                    </div>
                  );
                })}
              </div>
              {accountActions.map((actionPerformed, index) => {
                return (
                  <div className="table-row" key={index}>
                    {tableHeader.map((columnKey, idx) => {
                      if (
                        columnKey !== "customFields"
                      )
                      return (
                        <div
                          key={idx}
                          className="table-field table-field--grey text-center"
                        >
                          {this.getDataRows(actionPerformed, columnKey, idx)}
                        </div>
                      );
                    })}
                    {tableHeader.includes("customFields") &&
                      customFieldHeaders.map((header, idx) => {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            { this.getCustomFieldValues(
                              actionPerformed.customFields,
                              header,
                              idx
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
              
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
    );
  }
}
