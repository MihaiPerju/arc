import React, {Component} from 'react';
import TableReport from './TableReport';
import ScheduleBlock from './../../ScheduleBlock.jsx';
import Notifier from "../../../../lib/Notifier";
import {EJSON} from "meteor/ejson";
import taskQuery from "/imports/api/tasks/queries/taskList";
import moment from "moment/moment";

export default class ReportHeader extends Component {
    constructor() {
        super();
        this.state = {
            schedule: false,
            tasks: []
        }
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
        taskQuery.clone({filters}).fetch((err, tasks) => {
            if (!err) {
                this.setState({
                    tasks
                })
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    openSchedule = () => {
        const {schedule} = this.state;
        this.setState({
            schedule: !schedule
        })
    };

    componentDidMount() {
        this.count.bind(this);
    }

    count = () => {
        const parent = document.getElementById('table');
        const sameClass = parent.getElementByClassName('table-container');
        for (i = 0; i < sameClass; i++) {
            console.log('sameClass.length')
        }
    };

    onEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    render() {
        const {report} = this.props;
        const {schedule, tasks} = this.state;

        const mainTable = {
            header: 'Account name',
            row: tasks.map((task, index) => {
                return {title: "Account No." + (index + 1)}
            })
        };

        const tableList = [
            {
                header: 'Account number',
                row: tasks.map((task, index) => {
                    return {title: task.acctNum}
                })
            },
            {
                header: 'Discharge date',
                row: tasks.map((task, index) => {
                    return {title: moment(task.dischrgDate).format('MM/DD/YYYY hh:mm')}
                })
            },
            {
                header: 'Patient Type',
                row: tasks.map((task, index) => {
                    return {title: task.ptType}
                })
            },
            {
                header: "Facility Code",
                row: tasks.map((task, index) => {
                    return {title: task.facCode}
                })
            },
            {
                header: "Patient Name",
                row: tasks.map((task, index) => {
                    return {title: task.ptName}
                })
            }
        ];
        return (
            <div className="main-content report-content">
                {
                    schedule ?
                        <ScheduleBlock report={report}/> :
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
                                    <button className="btn--white" onClick={this.openSchedule}>Schedule</button>
                                    <button onClick={this.onEdit} className="btn--white">Edit report</button>
                                </div>
                            </div>
                        </div>
                }
                {
                    !schedule &&
                    <div className="table-list">
                        <div className="left-side">
                            <TableReport
                                title={mainTable.header}
                                rows={mainTable.row}
                            />
                        </div>
                        <div className="right-side" id="table">
                            {
                                tableList.map(function (table, index) {
                                    return (
                                        <TableReport
                                            center
                                            key={index}
                                            title={table.header}
                                            rows={table.row}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}