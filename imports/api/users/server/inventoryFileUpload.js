import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import TaskService from '/imports/api/facilities/server/services/TaskImportingService';

createRoute('/uploads/inventory/:facilityId', ({facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const importRules = ParseService.getImportRules(facilityId);

    for (index of filenames) {
        const stream = fs.readFileSync(filenames[index]);
        const csvString = stream.toString();

        Papa.parse(csvString, {
                chunk: (results) => {
                    //the result needs to be performed here
                    TaskService.update(results.data, importRules);
                }
            }
        );
    }

    success();
});