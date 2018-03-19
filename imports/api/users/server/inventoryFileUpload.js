import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import TaskService from '/imports/api/facilities/server/services/TaskImportingService';
import Files from "../../files/collection";
import Facilities from "../../facilities/collection";
import os from 'os';
import fs from 'fs';

createRoute('/uploads/inventory/:facilityId', ({facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const importRules = ParseService.getImportRules(facilityId, 'inventoryRules');

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
                // the result needs to be performed here
                TaskService.update(results.data, importRules, links);
            }
        }
    );


    success();
});