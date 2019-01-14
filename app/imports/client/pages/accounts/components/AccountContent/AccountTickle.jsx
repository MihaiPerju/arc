import React from "react";
import Notifier from "../../../../lib/Notifier";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { AutoForm, AutoField, ErrorField } from "/imports/ui/forms";
import SimpleSchema from "simpl-schema";

export default class AccountTickle extends React.Component {
  constructor() {
    super();
    this.state = {
      tickleDate: moment(),
      isDisabled: false
    };
  }

  tickle = data => {
    const { accountId, closeRightPanel } = this.props;
    const { tickleDate } = this.state;
    Object.assign(data, {
      _id: accountId,
      tickleDate: new Date(tickleDate),
      tickleUserId: Meteor.userId()
    });
    this.setState({ isDisabled: true });

    Meteor.call("account.tickle", data, err => {
      if (!err) {
        Notifier.success("Account Tickled!");
        this.closeDialog();
        closeRightPanel();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  onChange = date => {
    this.setState({ tickleDate: date });
  };

  closeDialog = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { tickleDate, isDisabled } = this.state;
    return (
      <div className="action-block">
        <div className="input-datetime flex--helper flex--column">
          <span className="text-light-grey">Tickle date</span>
          <AutoForm onSubmit={this.tickle} schema={schema}>
            <DatePicker
              calendarClassName="cc-datepicker"
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={4}
              todayButton={"Today"}
              selected={tickleDate}
              onChange={this.onChange}
              fixedHeight
            />
            {!tickleDate && (
              <div className="alert-notice" required="">
                Tickle date is required
              </div>
            )}
            <br />
            <div className="form-group">
              <AutoField
                className="text-area"
                // 
                placeholder="Type tickle reason..."
                name="tickleReason"
              />
              <ErrorField name="tickleReason" />
              <br />
              <div className="btn-group">
                <button className="btn-cancel" onClick={this.closeDialog}>
                  Cancel
                </button>
                <button
                  style={isDisabled ? { cursor: "not-allowed" } : {}}
                  disabled={isDisabled}
                  type="submit"
                  className="btn--light-blue"
                >
               {isDisabled?<div> Loading<i className="icon-cog"/></div>:"Confirm & Send"}
                </button>
              </div>
            </div>
          </AutoForm>
        </div>
      </div>
    );
  }
}

const schema = new SimpleSchema({
  tickleReason: {
    type: String
  }
});
