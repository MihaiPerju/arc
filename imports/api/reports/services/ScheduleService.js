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
        Meteor.pdf.stream(htmlString, function (result) {
            Meteor.call(
                'report.send',
                'Alice <pms@app.com>',
                'bob@example.com',
                'Hello from Meteor!',
                "Hello {firstname},\n" +
                "\n" +
                "Attached to this email, you will find the report \"{reportName}\"\n" +
                "\n" +
                "Regards,\n" +
                "\n" +
                "PMS Team",
                {
                    filename: 'Report.pdf',
                    content: result
                }
            );
        });
    }
}