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

export default class AddReportColumn extends Component {
  constructor() {
    super();
    this.state = {
      accountSimpleColumn: [],
      insuranceColumn: [],
      metaDataColumn: {},
      reportColumnSchema: null
    };
  }

  componentWillMount() {
    const { mongoFilters } = this.props.report;

    Meteor.call(
      "report.getMetaDataColumns",
      mongoFilters,
      (err, metaDataColumn) => {
        if (!err) {
          this.setState({
            metaDataColumn
          });
          this.extendSchema();
        }
      }
    );
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

  extendSchema = () => {
    const { metaDataColumn } = this.state;
    const { hasHeader, noHeader } = metaDataColumn;

    noHeader.map(value => {
      schema.extend({
        [`metaData.${value}`]: {
          type: Boolean,
          optional: true,
          defaultValue: false
        }
      });
    });

    hasHeader.map(value => {
      schema.extend({
        [`metaData.${value}`]: {
          type: Boolean,
          optional: true,
          defaultValue: false
        }
      });
    });

    this.setState({
      reportColumnSchema: schema
    });
  };

  render() {
    const { report } = this.props;
    const { metaDataColumn, reportColumnSchema } = this.state;
    const { hasHeader, noHeader } = metaDataColumn;

    if (!reportColumnSchema) {
      return <div />;
    }

    return (
      <div>
        <Dialog
          title="Confirm"
          className="account-dialog"
          closePortal={this.closeDialog}
        >
          <div
            style={{ height: "350px", overflowY: "scroll" }}
            className="form-wrapper"
          >
            <AutoForm
              schema={reportColumnSchema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={report.reportColumns}
            >
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
              <ListField name="insurances" showListField={() => {}}>
                <ListItemField name="$">
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
              <div style={{ width: "50%", float: "left" }}>
                <div>Columns without Header:</div>
                {noHeader.map((col, index) => {
                  return (
                    <BoolField
                      key={`meta-no-heads-${index}`}
                      name={`metaData.${col}`}
                      label={col}
                    />
                  );
                })}
              </div>
              <div style={{ width: "50%", float: "left" }}>
                <div>Columns with Header:</div>
                {hasHeader.map((col, index) => {
                  return (
                    <BoolField
                      key={`meta-heads-${index}`}
                      name={`metaData.${col}`}
                      label={col}
                    />
                  );
                })}
              </div>
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
      </div>
    );
  }
}
