import {createRoute} from '/imports/api/s3-uploads/server/router';
import Papa from 'papaparse';
import fs from 'fs';

createRoute('/uploads/csv', ({error, filenames}) => {
    if (filenames.length != 1) {
        return error('Invalid number of files');
    }

    const stream = fs.readFileSync(filenames[0]);

    const csvString = stream.toString();
    //to decide what to use(complete or chunk)
    Papa.parse(csvString, {
            complete: (results, file) => {
                console.log(results);
            },
            // chunk: (results, parser) => {
            //     console.log("Row data:", results.data);
            //     console.log("Row errors:", results.errors);
            // },
        }
    );
});