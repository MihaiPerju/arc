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
import { reportTypes } from "/imports/api/reports/enums/reportType";
import AccountActions from "/imports/api/accountActions/collection";
import moment from "moment";

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
          const metadataColumns = this.getMetaDataColumns(reportId);
          _.map(metadataColumns, (value, key) => {
            if (key === "hasHeader") {
              value.map(header => {
                columns[`metadata[${header}]`] = `meta column: ${header}`;
              });
            } else {
              value.map(header => {
                columns[`metadata[${header}]`] = `meta column: ${header}`;
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
    const metadataArr = Accounts.find(filters, {
      fields: { metadata: 1, _id: 0 }
    }).fetch();

    const metadataColumn = { hasHeader: [], noHeader: [] };
    metadataArr.map(accountMetaData => {
      _.map(accountMetaData["metadata"], (value, key) => {
        if (key.indexOf("Column#") === -1) {
          metadataColumn["hasHeader"].push(key);
        } else {
          metadataColumn["noHeader"].push(key);
        }
      });
    });

    metadataColumn["hasHeader"] = Array.from(
      new Set(metadataColumn["hasHeader"])
    );
    metadataColumn["noHeader"] = Array.from(
      new Set(metadataColumn["noHeader"])
    );
    return metadataColumn;
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
    let filters = this.getFilters(reportId);

    //checking the report type
    const { type } = Reports.findOne({ _id: reportId });
    if(type === reportTypes.ACCOUNT_ACTIONS) {
      const accountActions = AccountActions.find(filters).fetch();
      const accountsId = accountActions.map(action => action.accountId);
      filters = { _id: { $in : accountsId } }
    }

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

    let metadata = await AccountsRaw.aggregateSync([
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
          tag: { $arrayElemAt: ["$tag", 0] }
        }
      },
      {
        $sample: {
          size: 20
        }
      }
    ]).toArray();

    let headers = this.getColumns(reportId);

    metadata = metadata.map(m => {
      if (m.tag && m.workQueueId) m.workQueueId = m.tag.name;
      return m;
    });

    const bindColumn = (d, key) => {
      if (key.includes("metadata")) {
        var metadataKeys = key.split("[");
        var metadataKey = metadataKeys[0];
        var subKey = metadataKeys[1].slice(0, -1);
        var value = d[metadataKey][subKey];
        return `${value != undefined ? value : ""}`;
      } else if (key.includes("insurances")) {
        var insKeys = key.split(".");
        var objectKeys = insKeys[0].split("[");
        var propKey = insKeys[1];
        var insuranceKey = objectKeys[0];
        var indexKey = objectKeys[1].slice(0, -1);
        var value = d[insuranceKey][indexKey][propKey];
        return `${value != undefined ? value : ""}`;
      } else if (key.includes("Date")) {
        var value = d[key];
        return `${value != undefined ? moment(value).format("MM/DD/YYYY, hh:mm a") : ""}`;
      } 
      else return `${d[key]}`;
    };

    // Render HTML
    const renderHtml = meta => {
      let dataCell = [];
      
      let dataCellNew = [];
      meta.map((data, index) => {
        let cnt = 1;
        let userArray = [];
        Object.keys(headers).map((item, indexCell) => {
          let newObj = { d: data, headers: item }
            userArray.push(newObj);
        })
        dataCellNew.push(userArray);
      })

      let pdfDataNew = ``;
      //Table header
      pdfDataNew += `<table style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%; margin-bottom: 10px; padding: 10px;'>`;
      pdfDataNew += `<tr>`
      Object.keys(headers).map((item, indexCell) => {
        if(!item.includes("metadata") &&  !item.includes("insurances") ) {
          pdfDataNew += `<td style='text-align:left; font-size:9px; width:210px; padding: 12px; font-weight: bold;' >${item}</td>`;
        }
      })
      pdfDataNew += `</tr>`
      pdfDataNew += `</table>`;


      dataCellNew.map((data, index) => {
        pdfDataNew += `<table style='font-family: arial, sans-serif; border-collapse: collapse; border:1px solid #181472; width: 100%; margin-bottom: 10px; padding: 5px; border-bottom: 5px solid #181472;'>`;
         /** Table Labels */
         pdfDataNew += `<tr>`
         data.map((res) => {
          if(!res.headers.includes("metadata") &&  !res.headers.includes("insurances") ) {
            let cellValue = bindColumn(res.d, res.headers);
            if(!cellValue || cellValue == 'undefined' || cellValue == 'null') {
              cellValue = '--';
            }
            pdfDataNew += `<td style='text-align:left; font-size:9px; width:100px; padding: 5px;' >${cellValue}</td>`;
          }
         })
         pdfDataNew += `</tr>`
        pdfDataNew += `</table>`;
      })
      return pdfDataNew;

     /*  const data = (
        <Container>
          <Table textAlign="center" celled>
            <Table.Body>
              <Table.Row>
                {Object.keys(headers).map(item => (
                  <Table.Cell key={item}>{item}</Table.Cell>
                ))}
              </Table.Row>
              {meta.map((d, index) => (
                <Table.Row key={index}>
                  {Object.keys(headers).map((item, index) => {
                    return (
                      <Table.Cell key={index}>{bindColumn(d, item)}</Table.Cell>
                    );
                  })}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      );
      return ReactDOMServer.renderToString(data); */
    };

    const reportContent = renderHtml(metadata);

    try {
      let options = { format: 'A3', orientation: 'landscape', header: { height: "10mm" }, footer: { height: "10mm" } };
      pdf.create(reportContent, options ).toFile(pdfFilePath, (err, res) => {
        if (err) {
          future.return(err);
        } else {
          future.return(res);
        }
      });
    } catch (err) {
      JobQueue.update(
        {
          _id
        },
        {
          $set: {
            status: StatusEnum.FAILED
          }
        }
      );
      return;
    }

    //Catching error
    stringifier.on("error", function(err) {
      JobQueue.update(
        {
          _id
        },
        {
          $set: {
            status: StatusEnum.FAILED
          }
        }
      );
      return;
    });

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
