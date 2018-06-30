import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';
import AccountService from '/imports/api/facilities/server/services/AccountImportingService';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import Files from '/imports/api/files/collection';
import os from 'os';
import Facilities from '/imports/api/facilities/collection';

createRoute('/uploads/csv/:facilityId', ({facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }
    const importRules = ParseService.getImportRules(facilityId, 'placementRules');

    //Parsing and getting the CSV like a string
    let fileName = filenames[0].replace(os.tmpDir() + '/', '');
    const stream = fs.readFileSync(filenames[0]);
    const csvString = stream.toString();


    //Keep reference to previous file
    const {fileId} = Facilities.findOne({_id: facilityId});
    const newFileId = Files.insert({fileName, facilityId, previousFileId: fileId});

    //Add reference to facility
    Facilities.update({_id: facilityId}, {
        $set: {
            fileId: newFileId
        }
    });

    //Pass links to accounts to link them too
    const links = {facilityId, fileId: newFileId};

    Papa.parse(csvString, {
            chunk: (results) => {
                AccountService.upload(results.data, importRules, links);
            }
        }
    );


    success();
});