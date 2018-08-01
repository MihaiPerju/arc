import Papa from "papaparse";
import fs from "fs";
import AccountService from "/imports/api/facilities/server/services/AccountImportingService";
import ParseService from "/imports/api/facilities/server/services/CsvParseService";
import Files from "/imports/api/files/collection";
import os from "os";
import Facilities from "/imports/api/facilities/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";
import JobQueue from '/imports/api/jobQueue/collection';
import fileTypes from "/imports/api/files/enums/fileTypes";
import Business from "/imports/api/business";
import Settings from "/imports/api/settings/collection";
import jobStatuses from "/imports/api/jobQueue/enums/jobQueueStatuses";

export default class InventoryService {
    static run() {
        //Look for an untaken job
        const job = JobQueue.findOne({
            workerId: null,
            fileType: fileTypes.INVENTORY
        });
        if (job) {
            //Update the job as taken
            JobQueue.update({
                _id: job._id
            }, {
                $set: {
                    workerId
                }
            })
            this.processPlacement(job);
        }
    }

    static processPlacement({
        facilityId,
        filePath,
        userId,
        _id
    }) {

        const {
            rootFolder
        } = Settings.findOne({
            rootFolder: {
                $ne: null
            }
        });

        const importRules = ParseService.getImportRules(
            facilityId,
            "inventoryRules"
        );

        //Parsing and getting the CSV like a string
        const stream = fs.readFileSync(rootFolder + Business.ACCOUNTS_FOLDER + filePath);
        const csvString = stream.toString();

        //Keep reference to previous file
        const {
            fileId,
            clientId
        } = Facilities.findOne({
            _id: facilityId
        });
        const newFileId = Files.insert({
            fileName: filePath,
            facilityId,
            previousFileId: fileId
        });

        const fileData = {
            type: actionTypesEnum.FILE,
            createdAt: new Date(),
            fileId: newFileId,
            fileName: filePath,
            userId: userId,
            clientId
        };

        const accountActionId = AccountActions.insert(fileData);

        //Add reference to facility
        Facilities.update({
            _id: facilityId
        }, {
            $set: {
                fileId: newFileId
            },
            $push: {
                fileIds: accountActionId
            }
        });

        //Pass links to accounts to link them too
        const links = {
            facilityId,
            fileId: newFileId
        };

        Papa.parse(csvString, {
            chunk: results => {
                // the result needs to be performed here
                AccountService.update(results.data, importRules, links);
            },
            complete: () => {
                JobQueue.update({
                    _id
                }, {
                    $set: {
                        status: jobStatuses.FINISHED
                    }
                })
                // executed after all files are complete
            }
        });
    }
}