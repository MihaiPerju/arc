import React, {Component} from 'react';
import ReportHeader from './components/ReportContent/ReportHeader';
import TableReport from './components/ReportContent/TableReport';

export default class ReportContent extends Component {
    constructor() {
        super();
    }

    render() {
        const {report} = this.props;
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
            }
        ];

        return (
            <div className="main-content report-content">
                <ReportHeader report={report}/>

                <div className="table-list">
                    <div className="left-side">
                        <TableReport
                            title={mainTable.header}
                            rows={mainTable.row}
                        />
                    </div>
                    <div className="right-side">
                        {
                            tableList.map(function(table, index){
                                return (
                                    [0].indexOf(index) > -1 ? (
                                        <TableReport
                                            fixed
                                            key={index}
                                            title={table.header}
                                            rows={table.row}
                                        />
                                    ) : (
                                        <TableReport
                                            key={index}
                                            title={table.header}
                                            rows={table.row}
                                        />
                                    )
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}