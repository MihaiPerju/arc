import moment from "moment";
import ReportsEnum from "/imports/api/schedules/enums/reports";
import Schedules from "/imports/api/schedules/collection";
import Reports from "/imports/api/reports/collection";
import { EJSON } from "meteor/ejson";
import accountQuery from "/imports/api/accounts/queries/accountList";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { Container, Table } from "semantic-ui-react";
import pdf from "html-pdf";
import Users from "/imports/api/users/collection";
import Clients from "/imports/api/clients/collection";

const AccountData = ({ account }) => {
  return (
    <Container>
      <Table textAlign="center" celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>AcctNum</Table.Cell>
            <Table.Cell>{account && account.acctNum}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>FacCode</Table.Cell>
            <Table.Cell>{account && account.facCode}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>PtType</Table.Cell>
            <Table.Cell>{account && account.ptType}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>PtName</Table.Cell>
            <Table.Cell>{account && account.ptName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>DischrgDate</Table.Cell>
            <Table.Cell>
              {account &&
                moment(account.dischrgDate).format("MM/DD/YYYY hh:mm")}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>FbDate</Table.Cell>
            <Table.Cell>
              {account && moment(account.fbDate).format("MM/DD/YYYY hh:mm")}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>AcctBal</Table.Cell>
            <Table.Cell> {account && account.acctBal}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>FinClass</Table.Cell>
            <Table.Cell>{account && account.finClass}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>AdmitDate</Table.Cell>
            <Table.Cell>
              {account && moment(account.admitDate).format("MM/DD/YYYY hh:mm")}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>MedNo</Table.Cell>
            <Table.Cell>{account && account.medNo}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsName</Table.Cell>
            <Table.Cell>{account && account.insName}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsName2</Table.Cell>
            <Table.Cell>{account && account.insName2}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsName3</Table.Cell>
            <Table.Cell>{account && account.insName3}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsCode</Table.Cell>
            <Table.Cell>{account && account.insCode}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsCode2</Table.Cell>
            <Table.Cell>{account && account.insCode2}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsCode3</Table.Cell>
            <Table.Cell>{account && account.insCode3}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsBal</Table.Cell>
            <Table.Cell>{account && account.insBal}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsBal2</Table.Cell>
            <Table.Cell>{account && account.insBal2}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>InsBal3</Table.Cell>
            <Table.Cell>{account && account.insBal3}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>State</Table.Cell>
            <Table.Cell>{account && account.state}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Container>
  );
};

export default class CronjobService {
  static checkTime() {
    const now = moment();
    const tomorrow = moment().add("1", "days");

    //Runs only at 3 AM
    if (now.hour() == 3) {
      //Check the week day.
      switch (now.day()) {
        case 0:
          //Sunday
          CronjobService.sendReports(ReportsEnum.frequency[6].value);
          break;
        case 1:
          //Monday
          CronjobService.sendReports(ReportsEnum.frequency[0].value);
          break;
        case 2:
          //Tuesday
          CronjobService.sendReports(ReportsEnum.frequency[1].value);
          break;
        case 3:
          //Wednesday
          CronjobService.sendReports(ReportsEnum.frequency[2].value);
          break;
        case 4:
          //Thursday
          CronjobService.sendReports(ReportsEnum.frequency[3].value);
          break;
        case 5:
          //Friday
          CronjobService.sendReports(ReportsEnum.frequency[4].value);
          break;
        case 6:
          //Saturday
          CronjobService.sendReports(ReportsEnum.frequency[5].value);
          break;
      }

      //Check the day of Month
      if (now.date() === 1) {
        CronjobService.sendReports(ReportsEnum.frequency[7].value);
      }

      if ([28, 29, 30, 31].includes(now.date())) {
        //28,29,30,31 can be last days. If the next day is the first
        // day of month then it's the last day of the actual month
        if (tomorrow.date() === 1) {
          CronjobService.sendReports(ReportsEnum.frequency[8].value);
        }
      }

      //Check the day of the year
      if (now.dayOfYear() === 1) {
        //Beginning of the year
        CronjobService.sendReports(ReportsEnum.frequency[9].value);
      }
      if (tomorrow.dayOfYear() === 1) {
        //If the next day is the first day of year now is the End of the actual year
        CronjobService.sendReports(ReportsEnum.frequency[10].value);
      }
    }
  }

  static sendReports(frequency) {
    const schedules = Schedules.find({
      frequency: { $in: [frequency] }
    }).fetch();
    for (let schedule of schedules) {
      CronjobService.executeSchedule(schedule);
    }
  }

  static executeSchedule(schedule) {
    const _id = schedule.reportId;
    const report = Reports.findOne({ _id });
    const filters = EJSON.parse(report.mongoFilters);
    const userIds = schedule.userIds;
    const clientIds = schedule.clientIds;
    const accounts = accountQuery.clone({ filters }).fetch();

    CronjobService.createReportPdf(userIds, clientIds, accounts, report);
  }

  static createReportPdf(userIds, clientIds, accounts, report) {
    let ReportTable = "";
    for (let account of accounts) {
      const accountSingle = <AccountData account={account} />;

      ReportTable += ReactDOMServer.renderToString(accountSingle) + "<br/>";
    }

    pdf.create(ReportTable).toStream(
      Meteor.bindEnvironment((err, attachment) => {
        if (!err) {
          CronjobService.sendEmails(userIds, attachment, report);
        }
      })
    );
  }

  static sendEmails(userIds, clientIds, attachment, report) {
    const users = Users.find({ _id: { $in: userIds } }).fetch();
    const clients = Clients.find({ _id: { $in: clientIds } }).fetch();

    const allReceivers = [];

    for (let user of users) {
      allReceivers.push({
        email: user.emails[0].address,
        name: user.profile.firstName
      });
    }

    for (let client in clients) {
      allReceivers.push({ email: client.email, name: client.firstName });
    }

    for (let receiver of allReceivers) {
      const to = receiver.email;
      const from = "PMS <pms@app.com>";
      const subject = "Reports";
      const text =
        `Hello ${receiver.name},\n` +
        "\n" +
        `Attached to this email, you will find the report '${report.name}'\n` +
        "\n" +
        "Regards,\n" +
        "\n" +
        "PMS Team";
      const attachments = {
        filename: "Report.pdf",
        content: attachment
      };
      Email.send({ to, from, subject, text, attachments });
    }
  }
}
