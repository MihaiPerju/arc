import React from 'react'
import Notifier from '/imports/client/lib/Notifier';
import TaskData from '/imports/client/pages/tasks/components/TaskData';
import ReactDOMServer from 'react-dom/server';

export default class ScheduleService {
    static createReportPdf(userIds, tasks, report) {

        let ReportTable = '';
        for (task of tasks) {
            const taskSingle = <TaskData task={task}/>;

            ReportTable += ReactDOMServer.renderToString(taskSingle) + '<br/>';
        }

        Meteor.pdf.stream(ReportTable, function (result) {
            ScheduleService.sendEmails(userIds, result, report);
            Notifier.success("Emails sent!");
        });
    }

    static sendEmails(userIds, attachment, report) {
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
                                content: attachment
                            }
                        );
                    }
                }
            })
        }
    }
}