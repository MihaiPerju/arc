import React, {Component} from 'react';
import ReportHeader from './components/ReportContent/ReportHeader';
import TableReport from './components/ReportContent/TableReport';
<<<<<<< HEAD
=======
import ScheduleBlock from './ScheduleBlock.jsx';
import Notifier from "../../lib/Notifier";
import {EJSON} from "meteor/ejson";
import taskQuery from "../../../api/tasks/queries/taskList";
import moment from "moment/moment";
>>>>>>> origin/ui-schedules

export default class ReportContent extends Component {
    constructor() {
        super();
<<<<<<< HEAD
    }

=======
        this.state = {
            schedule: false,
            tasks: []
        }
    }

    componentWillMount() {
        const {report} = this.props;
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

>>>>>>> origin/ui-schedules
    componentDidMount() {
        this.count.bind(this);
    }

    count = () => {
        const parent = document.getElementById('table');
        const sameClass = parent.getElementByClassName('table-container');
<<<<<<< HEAD
        for(i=0; i< sameClass; i++) {
            console.log('sameClass.length')            
        }
    }

    render() {
        const {report, schedule} = this.props;
        const mainTable = {
            header: 'Task name',
            row: [
                { title: 'Task name nr. 1' },
                { title: 'Task name nr. 2' },
                { title: 'Task name nr. 3' },
                { title: 'Task name nr. 4' },
                { title: 'Task name nr. 5' }
            ]
        }
        const tableList = [
            {
                header: 'Account number',
                row: [
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' }
                ]
            },
            {
                header: 'Discarge date',
                row: [
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' }
                ]
            },
            {
                header: 'Discarge date',
                row: [
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' }
                ]
            },
            {
                header: 'Discarge date',
                row: [
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' },
                    { title: 'none' }
                ]
            }
        ];

        return (
            <div className="main-content report-content">
                <ReportHeader report={report} schedule={schedule}/>

                <div className="table-list">
                    <div className="left-side">
                        <TableReport
                            title={mainTable.header}
                            rows={mainTable.row}
                        />
                    </div>
                    <div className="right-side" id="table">
                        {
                            tableList.map(function(table, index){
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
=======
        for (i = 0; i < sameClass; i++) {
            console.log('sameClass.length')
        }
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
                header: 'Payment Type',
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
                header: "Payment Name",
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
                        <ReportHeader openSchedule={this.openSchedule} report={report}/>
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

>>>>>>> origin/ui-schedules
            </div>
        )
    }
}