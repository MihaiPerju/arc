import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';
import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import PaymentService from '/imports/api/facilities/server/services/PaymentService';

createRoute('/uploads/payment/:facilityId', ({facilityId, error, filenames, success}) => {

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const importRules = ParseService.getImportRules(facilityId, 'paymentRules');

    for (index in filenames) {
        const stream = fs.readFileSync(filenames[index]);
        const csvString = stream.toString();

        Papa.parse(csvString, {
                chunk: (results) => {
                    // the result needs to be performed here
                    PaymentService.upload(results.data, importRules, facilityId);
                }
            }
        );
    }

    success();
});