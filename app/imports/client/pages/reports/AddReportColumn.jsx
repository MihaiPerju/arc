import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import reportColumnEnum, {
  insuranceColumnEnum
} from "../../../api/reports/enums/reportColumn";
import schema from "/imports/api/reports/schemas/reportColumnSchema";
import {
  AutoForm,
  ListField,
  ListItemField,
  NestField,
  BoolField
} from "/imports/ui/forms";
import Notifier from "/imports/client/lib/Notifier";
import classNames from "classnames";

export default class AddReportColumn extends Component {
  constructor() {
    super();
    this.state = {
      accountSimpleColumn: [],
      insuranceColumn: [],
      reportColumnSchema: null,
      reportColumns: null,
      isSelectedAll: false
    };
  }

  componentWillMount() {
    this.setState({
      reportColumnSchema: schema
    });
  }

  componentDidMount() {
    const { report } = this.props;
    this.bindReportColums(report);
  }

  bindReportColums(report) {
    let isSelectAll = false;
    let reportColumns = report.reportColumns;
    let reportColumnString = JSON.stringify(reportColumns);
    isSelectAll = !reportColumnString.includes('false');
    this.setState({ reportColumns: report.reportColumns, isSelectedAll: isSelectAll })
  }

  closeDialog = () => {
    this.props.closeDialog();
  };

  confirm = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSubmit = data => {
    const { closeDialog, report } = this.props;
    const { _id, name } = report;
    Meteor.call("report.updateColumns", _id, name, data, err => {
      if (!err) {
        closeDialog();
      } else {
        Notifier.error(err);
      }
    });
  };

  checkAllColumns = () => {

    const { isSelectedAll, reportColumns } = this.state;
    let selectAll = !isSelectedAll;
    var selectedColumns = Object.keys(reportColumns).map(key => {
      if (key != 'insurances')
        return ({ key, value: selectAll });
      else
        return ({
          key, value: reportColumns[key].map((ins) => {
            let insObject = {};
            let insColumns = Object.keys(ins).map(insKey => ({ insKey, value: selectAll }));
            insColumns.map((c) => {
              insObject[c.insKey] = c.value;
            });
            return insObject;
          })
        });
    });
    let reportColumnObject = {};
    selectedColumns.map((column) => {
      reportColumnObject[column.key] = column.value;
    });
    this.setState({ isSelectedAll: selectAll, reportColumns: reportColumnObject });

  }

  addInsuranceColumns = () => {
    let reportColumns = this.state.reportColumns;
    let newInsuranceObj = {};
    insuranceColumnEnum.map((column) => {
      newInsuranceObj[column.value] = this.state.isSelectedAll;
    });
    reportColumns.insurances.push(newInsuranceObj);
    this.setState({ reportColumns });
  }

  removeInsuranceColumns = (index) => {
    let reportColumns = this.state.reportColumns;
    reportColumns.insurances.splice(index, 1);
    this.setState({ reportColumns });
  }

  render() {
    const btnSelectClasses = classNames({
      "btn-select-all": true,
      active: this.state.isSelectedAll
    });
    // const { report } = this.props;
    const { reportColumnSchema, reportColumns } = this.state;

    if (!reportColumnSchema) {
      return <div />;
    }

    return (
      <div>
        <Dialog
          title="Confirm"
          className="account-dialog"
          closePortal={this.closeDialog}>
          <div
            style={{ height: "350px", overflowY: "scroll" }}
            className="form-wrapper">
            <div className="m-b--10">
              <div className={btnSelectClasses} onClick={this.checkAllColumns} /> <label>Select All</label>
            </div>
            <AutoForm
              schema={reportColumnSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={reportColumns}>
              {reportColumnEnum.map((cols, index) => {
                const { value, label } = cols;
                return (
                  <BoolField
                    key={`normal-${index}`}
                    name={value}
                    label={label}
                  />
                );
              })}
              <ListField name="insurances" showListField={() => this.addInsuranceColumns()}>
                <ListItemField name="$" hideListField={(index) => { this.removeInsuranceColumns(index) }}>
                  <NestField className="upload-item text-center">
                    {insuranceColumnEnum.map((data, index) => {
                      const { value, label } = data;
                      return (
                        <BoolField
                          key={`insurance-${index}`}
                          name={value}
                          label={label}
                        />
                      );
                    })}
                  </NestField>
                </ListItemField>
              </ListField>
            </AutoForm>
          </div>
          <div className="btn-group">
            <button className="btn-cancel" onClick={this.closeDialog}>
              Cancel
            </button>
            <button className="btn--light-blue" onClick={this.confirm}>
              Confirm & Add
            </button>
          </div>
        </Dialog>
      </div >
    );
  }
}


