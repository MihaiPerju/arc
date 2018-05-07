import React, {Component} from "react";
import TableReport from "./TableReport";
import ScheduleBlock from "./../../ScheduleBlock.jsx";
import Notifier from "../../../../lib/Notifier";
import {EJSON} from "meteor/ejson";
import accountsQuery from "/imports/api/tasks/queries/taskList";
import moment from "moment/moment";

export default class ReportHeader extends Component {
    constructor() {
        super();
        this.state = {
            schedule: false,
            accounts: []
        };
    }

    componentWillMount() {
        this.getTasks(this.props);
    }

    componentWillReceiveProps(props) {
        this.getTasks(props);
    }

    getTasks(props) {
        const {report} = props;
        const filters = EJSON.parse(report.mongoFilters);
        Meteor.call("accounts.getSample", filters, (err, accounts) => {
            if (!err) {
                this.setState({
                    accounts
                });
            } else {
                Notifier.error("Couldn't get sample accounts");
            }
        });
    }

    openSchedule = () => {
        const {schedule} = this.state;
        this.setState({
            schedule: !schedule
        });
    };

    componentDidMount() {
        this.count.bind(this);
    }

    count = () => {
        const parent = document.getElementById("table");
        const sameClass = parent.getElementByClassName("table-container");
        for (i = 0; i < sameClass; i++) {
            console.log("sameClass.length");
        }
    };

    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {report} = this.props;
        const {schedule, accounts} = this.state;
        const mainTable = {
            header: "Account name",
            row: accounts.map((task, index) => {
                return {title: "Account No." + (index + 1)};
            })
        };

        const tableHeader = [
            'Account name', 'Account number', 'Discharge date', 'Patient Type', 'Facility Code', 'Patient Name'
           ,"Last Bill Date","Account Balance","Financial Class","Admit Date","Medical Number"];

        return (
            <div className="main-content report-content">
                {schedule ? (
                    <ScheduleBlock report={report}/>
                ) : (
                    <div className="main-content__header header-block">
                        <div className="row__header">
                            <div className="text-light-grey">Report name</div>
                            <div className="title">{report.name}</div>
                        </div>
                        <div className="row__header">
                            <div className="plasment-block">
                                <div className="text-light-grey">Placement date</div>
                                <div className="time">11:20</div>
                            </div>
                            <div className="btn-group">
                                <button className="btn--white" onClick={this.openSchedule}>
                                    Schedule
                                </button>
                                <button onClick={this.onEdit} className="btn--white">
                                    Edit report
                                </button>
                                <button style={{marginLeft: "2rem"}} className="btn--white">
                                    Run report
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {!schedule && (
                    <div className="table-list">
                        <div className="table-list__wrapper">
                            <div className="table-container">
                                <div className="table-row">
                                    {
                                        tableHeader.map(function (header, index) {
                                            return (
                                                (index == 0) ? (
                                                    <div key={index} className="left-side">
                                                        <div className="table-header truncate text-left table-field table-field--fixed text-light-grey">
                                                            {header}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={index}
                                                         className="table-header text-center table-field text-light-grey">
                                                        {header}
                                                    </div>
                                                )
                                            )
                                        })
                                    }
                                </div>

                                {
                                    accounts.map((account, index) => {
                                        return (
                                            <div className="table-row" key={index}>
                                                <div className="left-side">
                                                    <div className="table-field table-field--fixed truncate text-center">
                                                        {'Account No.' + (index + 1)}
                                                    </div>
                                                </div>
                                                <div className="right-side">
                                                    <div className="table-field text-center">{account.acctNum}</div>
                                                    <div className="table-field text-center">
                                                        {moment(account.dischrgDate).format("MM/DD/YYYY hh:mm")}
                                                    </div>
                                                    <div className="table-field text-center">{account.ptType}</div>
                                                    <div className="table-field text-center">{account.facCode}</div>
                                                    <div className="table-field text-center">{account.ptName}</div>
                                                    <div className="table-field text-center">
                                                        {moment(account.fbDate).format("MM/DD/YYYY hh:mm")}
                                                    </div>
                                                    <div className="table-field text-center">{account.acctBal}</div>
                                                    <div className="table-field text-center">{account.finClass}</div>
                                                    <div className="table-field text-center">
                                                        {moment(account.admitDate).format("MM/DD/YYYY hh:mm")}
                                                    </div>
                                                    <div className="table-field text-center">{account.medNo}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}