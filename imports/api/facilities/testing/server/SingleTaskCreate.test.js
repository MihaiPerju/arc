import ParseService from '/imports/api/facilities/server/services/CsvParseService';
import {chai} from 'meteor/practicalmeteor:chai';

describe('Create Task from CSV', function () {
    it("Must create a task from an CSV ", function () {

        const input = ['007', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',]
        const importingRules = {
            acctNum: 1,
            facCode: 2,
            ptType: 3,
            ptName: 4,
            dischrgDate: 5,
            fbDate: 6,
            acctBal: 7,
            finClass: 8,
            admitDate: 9,
            medNo: 10,
            insName: 11,
            insName2: 12,
            insName3: 13,
            insCode: 14,
            insCode2: 15,
            insCode3: 16,
            insBal: 17,
            insBal2: 18,
            insBal3: 19
        };

        const output = ParseService.createTask(input, importingRules);
        expectedOutput = {
            'acctNum': '007',
            'facCode': '1',
            'ptType': '2',
            'ptName': '3',
            'dischrgDate': '4',
            'fbDate': '5',
            'acctBal': '6',
            'finClass': '7',
            'admitDate': '8',
            'medNo': '9',
            'insName': '10',
            'insName2': '11',
            'insName3': '12',
            'insCode': '13',
            'insCode2': '14',
            'insCode3': '15',
            'insBal': '16',
            'insBal2': '17',
            'insBal3': '18'
        };

        test = () => {
            for (key in output) {
                if (output[key] !== expectedOutput[key]) {
                    return false;
                }
            }
            return true;
        };

        // assert that test is true
        chai.assert(
            test() === true
        );
    });
});