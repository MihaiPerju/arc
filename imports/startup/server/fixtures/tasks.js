import Tasks from '/imports/api/tasks/collection';
import CsvParseService from '/imports/api/facilities/server/services/CsvParseService';

/*WARNING!
*
 *This fixtures are not finished, because of
  * needed link between the task and client,
   * facility and importing rules of a facility.
   * Do not use.*/

Meteor.startup(function () {
    if (Tasks.find().count() > 0) {
        return true;
    }

    //Fake Data that normally is received from parsing csv
    let input;

    //Fake Data that normally is expected to be received from parsing array into object
    let output;

    //Generated orders, rules and importing rules
    let orders = [];

    //Array of labels for importing rules
    let rules = ['acctNum',
        'facCode',
        'ptType',
        'ptName',
        'dischrgDate',
        'fbDate',
        'acctBal',
        'finClass',
        'admitDate',
        'medNo',
        'insName',
        'insName2',
        'insName3',
        'insCode',
        'insCode2',
        'insCode3',
        'insBal',
        'insBal2',
        'insBal3'];

    //generate random order for importing rules
    generateOrder = () => {//generate output based on input and importingRules
        output = ParseService.return
        shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    };

    //generate importing rules based on random order generated before
    generateImportingRules = () => {
        let newImportingRules = {};
        for (i in orders) {
            newImportingRules[rules[i]] = orders[i];
        }
        return newImportingRules;
    };

    //generate fake array that normally is received by csv parser.
    generateInput = () => {
        let newInput = [];
        for (let i = 0; i < 19; i++) {
            newInput.push(faker.lorem.word());
        }
        return newInput;
    };

    //generate order of rules, importing rules and input test value
    orders = generateOrder();
    importingRules = generateImportingRules();
    input = generateInput();

    //generate output based on input and importingRules
    output = CsvParseService.createTask(input, importingRules);


    console.log('[ok] client fixtures have been loaded.');
});