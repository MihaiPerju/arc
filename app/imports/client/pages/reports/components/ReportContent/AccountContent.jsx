import React, { Component } from "react";
import moment from "moment";
import { types, fields } from "/imports/api/reports/enums/reportColumn";
import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";
import ordinal from "ordinal";
import Headers from "/imports/api/reports/enums/Headers";

export default class AccountContent extends Component {
  constructor() {
    super();
  }

  getHeaderNames = (header, index) => {
    if (header !== fields.METADATA && header !== fields.INSURANCES) {
      return (
        <div key={index}>
          {Headers[header] ? Headers[header].label : header}
        </div>
      );
    }
  };

  getColumnValues = (columnKeys, account, index) => {
    if (types.dates.includes(columnKeys)) {
      return (
        <div key={index}>
          {account[columnKeys] &&
            moment(account[columnKeys]).format("MM/DD/YYYY, hh:mm a")}
        </div>
      );
    } else if (columnKeys === "workQueueId") {
      return <div key={index}>{account["tag"] && account["tag"].name}</div>;
    } else {
      return <div key={index}>{account[columnKeys]}</div>;
    }
  };

  getMetadataHeaders() {
    const { accounts } = this.props;
    let metadataHeaders = [];
    _.map(accounts, account => {
      _.map(account.metaData, (value, key) => {
        if (!metadataHeaders.includes(key)) {
          metadataHeaders.push(key);
        }
      });
    });
    return metadataHeaders;
  }

  getMetadataValues(metadata, header, key) {
    return <div key={key}>{metadata[header]}</div>;
  }

  getInsuranceHeader = (insurance, index) => {
    return _.map(insurance, (value, key) => {
      if (value) {
        return (
          <div className="table-header text-center table-field text-light-grey">
            {ordinal(index + 1) + " " + Headers[key].label}
          </div>
        );
      }
    });
  };

  getInsuranceValues = (insuranceRules, insurance) => {
    return _.map(insuranceRules, (value, key) => {
      if (value) {
        return (
          <div className="table-field table-field--grey text-center">
            {insurance && insurance[key]}
          </div>
        );
      }
    });
  };

  render() {
    const { tableHeader, accounts, report } = this.props;
    const { reportColumns } = report;
    const metadataHeaders = this.getMetadataHeaders();
    return (
      <ScrollSync>
        <div className="table-container flex--helper">
          <ScrollSyncPane>
            <div className="table-container__left">
              <div className="table-header truncate text-left table-field text-light-grey">
                Account name
              </div>
              {accounts.map((account, index) => (
                <div key={index} className="table-field truncate">
                  {"Account No." + (index + 1)}
                </div>
              ))}
            </div>
          </ScrollSyncPane>
          <ScrollSyncPane>
            <div className="table-container__right">
              <div className="table-row">
                {tableHeader.map((header, index) => {
                  if (
                    header !== fields.METADATA &&
                    header !== fields.INSURANCES
                  ) {
                    return (
                      <div
                        key={index}
                        className="table-header text-center table-field text-light-grey"
                      >
                        {this.getHeaderNames(header, index)}
                      </div>
                    );
                  }
                })}
                {tableHeader.includes(fields.INSURANCES) &&
                  reportColumns.insurances.map((insurance, index) => {
                    return this.getInsuranceHeader(insurance, index);
                  })}
                {tableHeader.includes(fields.METADATA) &&
                  metadataHeaders.map((header, index) => {
                    return (
                      <div
                        key={index}
                        className="table-header text-center table-field text-light-grey"
                      >
                        {this.getHeaderNames(header, index)}
                      </div>
                    );
                  })}
              </div>
              {accounts.map((account, index) => {
                return (
                  <div className="table-row" key={index}>
                    {tableHeader.map((header, idx) => {
                      if (
                        header !== fields.METADATA &&
                        header !== fields.INSURANCES
                      )
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {this.getColumnValues(header, account, idx)}
                          </div>
                        );
                    })}
                    {tableHeader.includes(fields.INSURANCES) &&
                      reportColumns.insurances.map((insurance, index) => {
                        return this.getInsuranceValues(
                          insurance,
                          account.insurances && account.insurances[index],
                          index
                        );
                      })}
                    {tableHeader.includes(fields.METADATA) &&
                      metadataHeaders.map((header, idx) => {
                        return (
                          <div
                            key={idx}
                            className="table-field table-field--grey text-center"
                          >
                            {this.getMetadataValues(
                              account.metaData,
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
