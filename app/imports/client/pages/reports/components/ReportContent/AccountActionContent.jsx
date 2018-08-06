import React, { Component } from "react";
import moment from "moment";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import { accountActionHeader } from "/imports/api/reports/enums/Headers";

export default class AccountActionContent extends Component {
  constructor() {
    super();
  }

  render() {
    const { tableHeader, accountActions } = this.props;

    return (
      <ScrollSync>
        <div className="table-container flex--helper">
          <ScrollSyncPane>
            <div className="table-container__left">
              <div className="table-header truncate text-left table-field text-light-grey">
                Actions
              </div>
              {accountActions.map((action, index) => (
                <div key={index} className="table-field truncate">
                  {"Action No." + (index + 1)}
                </div>
              ))}
            </div>
          </ScrollSyncPane>
          <ScrollSyncPane>
            <div className="table-container__right">
              <div className="table-row">
                {tableHeader.map((header, index) => {
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
              </div>
              {accountActions.map((actionPerformed, index) => {
                return (
                  <div className="table-row" key={index}>
                    {tableHeader.map((columnKey, idx) => {
                      if (columnKey === "userId") {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {actionPerformed["user"] &&
                              `${actionPerformed["user"].profile.firstName} ${
                                actionPerformed["user"].profile.lastName
                              }`}
                          </div>
                        );
                      } else if (columnKey === "actionId") {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {actionPerformed["action"] &&
                              actionPerformed["action"].title}
                          </div>
                        );
                      } else if (columnKey === "customFields") {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {_.map(actionPerformed[columnKey], (value, key) => {
                              if (value) {
                                return (
                                  <div>
                                    <b>{key}: </b>
                                    <span>
                                      {typeof value === "object"
                                        ? moment(value).format(
                                            "MM/DD/YYYY, hh:mm"
                                          )
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
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {actionPerformed["account"] &&
                              actionPerformed["account"].acctNum}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className="table-field table-field--grey text-center"
                        >
                          {typeof actionPerformed[columnKey] === "object"
                            ? actionPerformed[columnKey] &&
                              moment(actionPerformed[columnKey]).format(
                                "MM/DD/YYYY, hh:mm"
                              )
                            : actionPerformed[columnKey]}
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
