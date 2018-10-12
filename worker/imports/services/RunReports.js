import JobQueue from "/imports/api/jobQueue/collection";
import Reports from "/imports/api/reports/collection";
import { EJSON } from "meteor/ejson";
import fs from "fs";
import FoldersEnum from "/imports/api/business.js";
import StatusEnum from "/imports/api/jobQueue/enums/jobQueueStatuses";
import Accounts from "/imports/api/accounts/collection";
import stringify from "csv-stringify";
import Headers from "/imports/api/reports/enums/Headers";
import NotificationService from "../api/notifications/server/services/NotificationService";
import { fields } from "/imports/api/reports/enums/reportColumn";
import JobQueueEnum from "/imports/api/jobQueue/enums/jobQueueTypes";
import pdf from "html-pdf";
import Future from "fibers/future";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Container, Table } from "semantic-ui-react";
import SettingsService from "/imports/api/settings/server/SettingsService";
import settings from "/imports/api/settings/enums/settings";

export default class RunReports {
  static run() {

    const job = JobQueue.findOne({
      workerId: null,
      type: JobQueueEnum.RUN_REPORT
    });
    if (job) {
      // Mark job as taken
      JobQueue.update(
        { _id: job._id },
        {
          $set: {
            workerId
          }
        }
      );
      //Create & Save .csv file
      this.saveReport(job);
    }
  }

  static checkFolder(pathToSave) {
    if (!fs.existsSync(pathToSave)) {
      fs.mkdirSync(pathToSave);
    }
  }

  static getFilters(reportId) {
    const { mongoFilters } = Reports.findOne({ _id: reportId });
    return EJSON.parse(mongoFilters);
  }

  static getColumns(reportId) {
    const { reportColumns } = Reports.findOne({ _id: reportId });
    const columns = {};

    _.map(reportColumns, (value, key) => {
      if (value && key !== fields.INSURANCES) {
        if (key === fields.METADATA) {
          const metaDataColumns = this.getMetaDataColumns(reportId);
          _.map(metaDataColumns, (value, key) => {
            if (key === "hasHeader") {
              value.map(header => {
                columns[`metaData[${header}]`] = `meta column: ${header}`;
              });
            } else {
              value.map(header => {
                columns[`metaData[${header}]`] = `meta column: ${header}`;
              });
            }
          });
        } else if (key === "workQueue") {
          columns["name"] = Headers[key] ? Headers[key].label : "";
        } else {
          columns[key] = Headers[key] ? Headers[key].label : "";
        }
      }
    });

    reportColumns.insurances.map((ins, i) => {
      _.map(ins, (value, key) => {
        if (value) {
          columns[`insurances[${i}].${key}`] = Headers[key]
            ? `${Headers[key].label} ${i + 1}`
            : "";
        }
      });
    });
    return columns;
  }

  static getMetaDataColumns(reportId) {
    const filters = this.getFilters(reportId);
    const metaDataArr = Accounts.find(filters, {
      fields: { metaData: 1, _id: 0 }
    }).fetch();

    const metaDataColumn = { hasHeader: [], noHeader: [] };
    metaDataArr.map(accountMetaData => {
      _.map(accountMetaData["metaData"], (value, key) => {
        if (key.indexOf("Column#") === -1) {
          metaDataColumn["hasHeader"].push(key);
        } else {
          metaDataColumn["noHeader"].push(key);
        }
      });
    });

    metaDataColumn["hasHeader"] = Array.from(
      new Set(metaDataColumn["hasHeader"])
    );
    metaDataColumn["noHeader"] = Array.from(
      new Set(metaDataColumn["noHeader"])
    );
    return metaDataColumn;
  }

  static async saveReport({ reportId, _id }) {
    const { root } = SettingsService.getSettings(settings.ROOT);

    //Path to new file
    const pathToSave = root + FoldersEnum.REPORTS_FOLDER;
    //Check and see if folder for saving is missing
    this.checkFolder(pathToSave);

    const filePath = pathToSave + "/" + reportId + ".csv";
    const pdfFilePath = pathToSave + "/" + reportId + ".pdf";
    const future = new Future();
    const file = fs.createWriteStream(filePath);

    //Getting filters
    const filters = this.getFilters(reportId);

    //Write file
    const AccountsNative = Accounts.rawCollection(filters);

    let columns = this.getColumns(reportId);
    columns = { ...columns, name: columns.workQueueId };
    delete columns.workQueueId;

    const stringifier = stringify({
      columns,
      header: true,
      delimiter: ","
    });

    const AccountsRaw = Accounts.rawCollection();

    AccountsRaw.aggregateSync = Meteor.wrapAsync(AccountsRaw.aggregate);

    let metaData = await AccountsRaw.aggregateSync([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "tags",
          localField: "workQueueId",
          foreignField: "_id",
          as: "tag"
        }
      },
      {
        $addFields: {
          "tag": { $arrayElemAt: ["$tag", 0] }
        }
      },
      {
        $sample: {
          size: 20
        }
      }
    ]).toArray();

    let headers = this.getColumns(reportId);

    metaData = metaData.map(m => {
      if (m.tag && m.workQueueId)
        m.workQueueId = m.tag.name;
      return m;
    });

    // Render HTML
    const renderHtml = meta => {
      const data = (
        <Container>
          <Table textAlign="center" celled>
            <Table.Body>
              <Table.Row>
                {Object.keys(headers).map(item => (
                  <Table.Cell key={item}>{item}</Table.Cell>
                ))}
              </Table.Row>
              {meta.map(d => (
                <Table.Row>
                  {Object.keys(headers).map(item => (
                    <Table.Cell>{d[item]}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      );
      return ReactDOMServer.renderToString(data);
    };

    const reportContent = renderHtml(metaData);

    pdf.create(reportContent).toFile(pdfFilePath, (err, res) => {
      if (err) {
        future.return(err);
      } else {
        future.return(res);
      }
    });
    //Catching
    // stringifier.on("error", function(err) {});

    stringifier.on(
      "finish",
      Meteor.bindEnvironment(() => {
        const { reportId } = JobQueue.findOne({
          _id
        });
        const { authorId } = Reports.findOne({
          _id: reportId
        });
        JobQueue.update(
          {
            _id
          },
          {
            $set: {
              status: StatusEnum.FINISHED
            }
          }
        );
        NotificationService.createReportNotification(authorId, reportId);
      })
    );

    AccountsNative.aggregate([
      {
        $match: filters
      },
      {
        $lookup: {
          from: "tags",
          localField: "workQueueId",
          foreignField: "_id",
          as: "tag"
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$tag", 0] }, "$$ROOT"]
          }
        }
      }
    ])
      .pipe(stringifier)
      .pipe(file);
  }
}
