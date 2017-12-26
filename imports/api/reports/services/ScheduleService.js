import React from 'react'
import reactElementToJSXString from 'react-element-to-jsx-string';

export default class ScheduleService {
    static createReportPdf(report) {

        const ReportTable =
            <table>
                <tr>
                    <th>ID</th>
                </tr>
                <tr>
                    <td>{report._id}</td>
                </tr>
            </table>;

        const htmlString = reactElementToJSXString(ReportTable);
        Meteor.pdf.save(htmlString, 'myFileName');
    }
}