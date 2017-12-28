import React from 'react'
import reactElementToJSXString from 'react-element-to-jsx-string';
import Notifier from '/imports/client/lib/Notifier';

export default class ScheduleService {
    static createReportPdf(userIds, tasks, report) {

        let ReportTable = '';
        for (task of tasks) {
            const taskSingle = <div>
                <table>
                    <tr>
                        <td>AcctNum</td>
                        <td>{task && task.acctNum}</td>
                    </tr>
                    <tr>
                        <td>FacCode</td>
                        <td>{task && task.facCode}</td>
                    </tr>
                    <tr>
                        <td>PtType</td>
                        <td>{task && task.ptType}</td>
                    </tr>
                    <tr>
                        <td>PtName</td>
                        <td>{task && task.ptName}</td>
                    </tr>
                    <tr>
                        <td>DischrgDate</td>
                        <td>{task && task.dischrgDate}</td>
                    </tr>
                    <tr>
                        <td>FbDate</td>
                        <td>{task && task.fbDate}</td>
                    </tr>
                    <tr>
                        <td>AcctBal</td>
                        <td> {task && task.acctBal}</td>
                    </tr>
                    <tr>
                        <td>FinClass</td>
                        <td>{task && task.finClass}</td>
                    </tr>
                    <tr>
                        <td>AdmitDate</td>
                        <td>{task && task.admitDate}</td>
                    </tr>
                    <tr>
                        <td>MedNo</td>
                        <td>{task && task.medNo}</td>
                    </tr>
                    <tr>
                        <td>InsName</td>
                        <td>{task && task.insName}</td>
                    </tr>
                    <tr>
                        <td>InsName2</td>
                        <td>{task && task.insName2}</td>
                    </tr>
                    <tr>
                        <td>InsName3</td>
                        <td>{task && task.insName3}</td>
                    </tr>
                    <tr>
                        <td>InsCode</td>
                        <td>{task && task.insCode}</td>
                    </tr>
                    <tr>
                        <td>InsCode2</td>
                        <td>{task && task.insCode2}</td>
                    </tr>
                    <tr>
                        <td>InsCode3</td>
                        <td>{task && task.insCode3}</td>
                    </tr>
                    <tr>
                        <td>InsBal</td>
                        <td>{task && task.insBal}</td>
                    </tr>
                    <tr>
                        <td>InsBal2</td>
                        <td>{task && task.insBal2}</td>
                    </tr>
                    <tr>
                        <td>InsBal3</td>
                        <td>{task && task.insBal3}</td>
                    </tr>
                    <tr>
                        <td>State</td>
                        <td>{task && task.state}</td>
                    </tr>
                </table>
                <p/>
            </div>;

            ReportTable += reactElementToJSXString(taskSingle);
        }

        const htmlString = reactElementToJSXString(ReportTable);
        Meteor.pdf.stream(htmlString, function (result) {
            ScheduleService.sendEmails(userIds, result, report);
            Notifier.success("Emails sent!");
        });
    }

    static sendEmails(userIds, result, report) {
        for (userId of userIds) {
            Meteor.call('users.get', userIds, (err, users) => {
                if (!err) {
                    for (user of users) {
                        const email = user.emails[0].address;
                        Meteor.call(
                            'report.send',
                            'PMS <pms@app.com>',
                            email,
                            'Hello from Meteor!',
                            `Hello ${user.profile.firstName},\n` +
                            "\n" +
                            `Attached to this email, you will find the report '${report.name}'\n` +
                            "\n" +
                            "Regards,\n" +
                            "\n" +
                            "PMS Team",
                            {
                                filename: 'Report.pdf',
                                content: result
                            }
                        );
                    }
                }
            })
        }

    }
}