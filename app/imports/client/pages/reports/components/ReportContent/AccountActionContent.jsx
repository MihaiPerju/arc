import React, { Component } from "react";
import moment from "moment";
import { accountActionHeader } from "/imports/api/reports/enums/Headers";

export default class AccountActionContent extends Component {
  constructor() {
    super();
  }

  render() {
    const { tableHeader, accountActions } = this.props;

    return (
      <div className="table-container">
        <div className="table-row">
          {tableHeader.map(function(header, index) {
            return index == 0 ? (
              <div className="table-header truncate text-left table-field table-field--fixed text-light-grey">
                {header}
              </div>
            ) : (
              <div
                key={index}
                className="table-header text-center table-field text-light-grey"
              >
                {accountActionHeader[header]
                  ? accountActionHeader[header]["label"]
                  : header}
              </div>
            );
          })}
        </div>
        {accountActions.map((actionPerformed, index) => {
          return (
            <div className="table-row" key={index}>
              <div className="table-field table-field--fixed truncate text-center">
                {`#${index + 1}`}
              </div>
              {tableHeader.map((columnKey, idx) => {
                if (idx > 0) {
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
                  }

                  return (
                    <div
                      key={idx}
                      className="table-field table-field--grey text-center"
                    >
                      {typeof actionPerformed[columnKey] === "object"
                        ? moment(actionPerformed[columnKey]).format(
                            "MM/DD/YYYY, hh:mm"
                          )
                        : actionPerformed[columnKey]}
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
