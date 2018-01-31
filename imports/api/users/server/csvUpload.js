import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';
import TaskService from '/imports/api/facilities/server/services/TaskImportingService';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';

createRoute('/uploads/csv/:facilityId', ({facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }
    const importRules = ParseService.getImportRules(facilityId);

    for (index in filenames) {
        const stream = fs.readFileSync(filenames[index]);
        const csvString = stream.toString();

        Papa.parse(csvString, {
                chunk: (results) => {
                    TaskService.upload(results.data, importRules, facilityId);
                }
            }
        );
    }

    success();
});