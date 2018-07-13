import React, { Component } from "react";
import Dialog from "/imports/client/lib/ui/Dialog";
import accountsQuery from "/imports/api/accounts/queries/accountList";
import reportColumnEnum, {
  insuranceColumnEnum
} from "../../../api/reportColumn/enum/reportColumn";
import schema from "/imports/api/reportColumn/schema";
import {
  AutoForm,
  ListField,
  ListItemField,
  NestField,
  BoolField
} from "/imports/ui/forms";
import reportColumnListQuery from "/imports/api/reportColumn/queries/reportColumnList";

export default class AddReportColumn extends Component {
  constructor() {
    super();
    this.state = {
      accountColumns: null,
      accountSimpleColumn: [],
      insuranceColumn: [],
      reportColumn: {}
    };
  }

  componentWillMount() {
    accountsQuery.clone().fetch((err, accountColumns) => {
      if (!err) {
        this.setState({
          accountColumns
        });
      }
    });

    reportColumnListQuery
      .clone({ userId: Meteor.userId() })
      .fetchOne((err, reportColumn) => {
        if (!err) {
          this.setState({ reportColumn });
        }
      });
  }

  closeDialog = () => {
    this.props.closeDialog();
  };

  confirm = () => {
    const { form } = this.refs;
    form.submit();
  };

  onSubmit = data => {
    const { closeDialog } = this.props;
    Meteor.call("reportColumn.create", data, err => {
      if (!err) {
        closeDialog();
      } else {
        console.log("err", err);
      }
    });
  };

  render() {
    const { reportColumn } = this.state;
    return (
      <div>
        <Dialog
          title="Confirm"
          className="account-dialog"
          closePortal={this.closeDialog}
        >
          <div className="form-wrapper">
            <AutoForm
              schema={schema}
              onSubmit={this.onSubmit.bind(this)}
              ref="form"
              model={reportColumn}
            >
              {reportColumnEnum.map(cols => {
                const { value, label } = cols;
                return <BoolField name={value} label={label} />;
              })}
              <ListField name="insurances" showListField={() => {}}>
                <ListItemField name="$">
                  <NestField className="upload-item text-center">
                    {insuranceColumnEnum.map((data, index) => {
                      const { value, label } = data;
                      return <BoolField name={value} label={label} />;
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
      </div>
    );
  }
}
