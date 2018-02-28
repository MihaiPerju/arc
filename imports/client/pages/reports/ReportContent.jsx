import React, {Component} from 'react';
import ReportHeader from './components/ReportContent/ReportHeader';
import TableReport from './components/ReportContent/TableReport';
import ScheduleBlock from './ScheduleBlock.jsx';

export default class ReportContent extends Component {
    constructor() {
        super();
        this.state = {
            schedule: false
        }
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

    render() {
        const {report} = this.props;
        const {schedule} = this.state;
        const mainTable = {
            header: 'Task name',
            row: [
                {title: 'Task name nr. 1'},
                {title: 'Task name nr. 2'},
                {title: 'Task name nr. 3'},
                {title: 'Task name nr. 4'},
                {title: 'Task name nr. 5'}
            ]
        }
        const tableList = [
            {
                header: 'Account number',
                row: [
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'}
                ]
            },
            {
                header: 'Discharge date',
                row: [
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'}
                ]
            },
            {
                header: 'Discharge date',
                row: [
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'}
                ]
            },
            {
                header: 'Discharge date',
                row: [
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'},
                    {title: 'none'}
                ]
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

            </div>
        )
    }
}