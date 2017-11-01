import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';
import TaskService from '/imports/api/facilities/server/services/TaskService';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';

createRoute('/uploads/csv/:facilityId', ({facilityId, error, filenames}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const importRules = ParseService.getImportRules(facilityId);
    const stream = fs.readFileSync(filenames[0]);
    const csvString = stream.toString();

    Papa.parse(csvString, {
            //using chunk to receive result by chunks to not crash the browser.
            // Alternative to complete loading is 'complete' function
            chunk: (results) => {
                TaskService.upload(results.data, importRules);
            }
        }
    );
});