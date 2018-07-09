import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import AccountService from '/imports/api/facilities/server/services/AccountImportingService';
import Files from "../../files/collection";
import Facilities from "../../facilities/collection";
import os from 'os';
import fs from 'fs';
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import AccountActions from "/imports/api/accountActions/collection";

createRoute('/uploads/inventory/:facilityId/:token', ({user, facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const importRules = ParseService.getImportRules(facilityId, 'inventoryRules');

    //Parsing and getting the CSV like a string
    let fileName = filenames[0].replace(os.tmpdir() + '/', '');
    const stream = fs.readFileSync(filenames[0]);
    const csvString = stream.toString();

    //Keep reference to previous file
    const {fileId} = Facilities.findOne({_id: facilityId});
    const newFileId = Files.insert({fileName, facilityId, previousFileId: fileId});
    
    const fileData = {
        type: actionTypesEnum.FILE,
        createdAt: new Date(),
        fileId: newFileId,
        fileName,
        userId: user._id
    };

    const accountActionId = AccountActions.insert(fileData);
    
    //Add reference to facility
    Facilities.update({_id: facilityId}, {
        $set: {
            fileId: newFileId
        },
        $push: {
            fileIds: accountActionId
        }
    });


    //Pass links to accounts to link them too
    const links = {facilityId, fileId: newFileId};

    Papa.parse(csvString, {
            chunk: (results) => {
                // the result needs to be performed here
                AccountService.update(results.data, importRules, links);
            }
        }
    );


    success();
});