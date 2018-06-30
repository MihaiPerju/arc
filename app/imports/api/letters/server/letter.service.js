import Letters from '../collection.js';
import htmlToPdf from 'html-to-pdf';
import os from 'os';
import Future from 'fibers/future';

class LetterService {
    getLetterTemporalPdfLoc(accountId, letterId) {
        const letter = Letters.findOne({
            _id: letterId,
            accountId,
        }, {
            fields: {body: 1},
        });

        const fileLocation = `${os.tmpdir()}/${letter._id}.pdf`;
        let future = new Future();

        htmlToPdf.convertHTMLString(letter.body, fileLocation,
            function(error, success) {
                future.return(error ? {error} : {success});
            },
        );
        const {success} = future.wait();
        return success ? fileLocation : success;
    }
}

export default new LetterService();