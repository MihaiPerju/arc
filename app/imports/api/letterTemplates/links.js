import LetterTemplates from './collection.js';
import Codes from '/imports/api/codes/collection';

LetterTemplates.addLinks({
    codes: {
        collection: Codes,
        type: 'many',
        field: 'codeIds'
    }
});