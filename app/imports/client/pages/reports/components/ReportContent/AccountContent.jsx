import React, { Component } from "react";
import moment from "moment";
import { types, fields } from "/imports/api/reports/enums/reportColumn";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
export default class AccountContent extends Component {
  constructor() {
    super();
  }

  getHeaderNames = (header, index) => {
    const { reportColumns } = this.props.report;
    if (header === fields.INSURANCES) {
      return (
        <div key={index}>
          {reportColumns[header].map(insurance => {
            return _.map(insurance, (value, key) => {
              if (value) {
                return (
                  <div
                    style={{
                      width: "32%",
                      float: "left",
                      borderRight: "1px #d7d7d7 solid"
                    }}
                  >
                    {key}
                  </div>
                );
              }
            });
          })}
        </div>
      );
    } else if (header === fields.METADATA) {
      return (
        <div key={index}>
          {_.map(reportColumns[header], (value, key) => {
            if (value) {
              return (
                <div
                  style={{
                    width: "32%",
                    float: "left",
                    borderRight: "1px #d7d7d7 solid"
                  }}
                >
                  {key}
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div key={index}>{header}</div>;
    }
  };

  getColumnValues = (columnKeys, account, index) => {
    const { reportColumns } = this.props.report;
    if (columnKeys === "insurances") {
      return (
        <div key={index}>
          {reportColumns[columnKeys].map((insurance, i) => {
            return _.map(insurance, (value, key) => {
              if (value) {
                return (
                  <div
                    style={{
                      width: "32%",
                      float: "left",
                      borderRight: "1px #d7d7d7 solid"
                    }}
                  >
                    {account.insurances[i] && account.insurances[i][key]}
                  </div>
                );
              }
            });
          })}
        </div>
      );
    } else if (columnKeys === "metaData") {
      return (
        <div key={index}>
          {_.map(reportColumns[columnKeys], (value, key) => {
            if (value) {
              return (
                <div
                  style={{
                    width: "32%",
                    float: "left",
                    borderRight: "1px #d7d7d7 solid"
                  }}
                >
                  {account.metaData && account.metaData[key]}
                </div>
              );
            }
          })}
        </div>
      );
    } else if (types.dates.includes(columnKeys)) {
      return (
        <div key={index}>
          {account[columnKeys] &&
            moment(account[columnKeys]).format("MM/DD/YYYY, hh:mm a")}
        </div>
      );
    } else if (columnKeys === "workQueue") {
      return <div key={index}>{account["tag"] && account["tag"].name}</div>;
    } else {
      return <div key={index}>{account[columnKeys]}</div>;
    }
  };

  render() {
    const { tableHeader, accounts } = this.props;

    return (
      <ScrollSync>
        <div className="table-container flex--helper">
          <ScrollSyncPane>
            <div className="table-container__left">
              <div className="table-header truncate text-left table-field text-light-grey">
                Account name
              </div>
              {accounts.map((account, index) => (
                <div className="table-field truncate">
                  {"Account No." + (index + 1)}
                </div>
              ))}
            </div>
          </ScrollSyncPane>
          <ScrollSyncPane>
            <div className="table-container__right">
              <div className="table-row">
                {tableHeader.map((header, index) => (
                  <div
                    key={index}
                    className="table-header text-center table-field text-light-grey"
                  >
                    {this.getHeaderNames(header, index)}
                  </div>
                ))}
              </div>
              {accounts.map((account, index) => {
                return (
                  <div className="table-row" key={index}>
                    {tableHeader.map((columnKeys, idx) => {
                      if (idx > 0) {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {this.getColumnValues(columnKeys, account, idx)}
                          </div>
                        );
                      }
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
