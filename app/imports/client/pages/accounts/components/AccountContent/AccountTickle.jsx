import React from 'react';
import SimpleSchema from "simpl-schema";
import Notifier from "../../../../lib/Notifier";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

export default class AccountTickle extends React.Component {

    constructor() {
        super();
        this.state = {
            tickleDate: moment()
        }
    }

    tickle = (e) => {
        e.preventDefault();
        const {accountId, closeRightPanel} = this.props;
        const {tickleDate} = this.state;
        const data = {};
        data._id = accountId;
        data.tickleDate = new Date(tickleDate);
        Meteor.call("account.tickle", data, (err) => {
            if (!err) {
                Notifier.success("Account Tickled!");
                this.closeDialog();
                closeRightPanel();
            } else {
                Notifier.error(err.reason);
            }
        })
    };

    onChange = (date) => {
        this.setState({tickleDate: date});
    }

    closeDialog = () => {
        const {close} = this.props;
        close();
    };

    render() {
        const {tickleDate} = this.state;
        return (
            <div className="action-block">
                <form onSubmit={this.tickle}>
                    <div className="input-datetime flex--helper flex--column">
                        <span>Tickle date</span>
                        <DatePicker selected={tickleDate} onChange={this.onChange}/>
                        {!tickleDate &&
                        <div className="alert-notice" required="">Tickle date is required</div>}
                    </div>
                    <div className="btn-group">
                        <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                        <button type="submit" className="btn--light-blue">
                            Confirm & send
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}