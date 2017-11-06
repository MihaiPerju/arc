import TaskService from '/imports/api/facilities/server/services/TaskImportingService';
import {chai} from 'meteor/practicalmeteor:chai';
import Tasks from '/imports/api/tasks/collection';
import {resetDatabase} from 'meteor/xolvio:cleaner';

describe('Import inventory files', function () {

    beforeEach(function () {
        resetDatabase();
    });

    it("Must update old documents and insert new documents", function () {

        const input1 = ['Number1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',]
        const input2 = ['Number2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',]

        const importingRules = {
            hasHeader: false,
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

        TaskService.upload([input1, input2, ''], importingRules);
        input1[1] = 'Modified';
        input2[3] = 'Modified too';
        const input3 = ['Number3', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18',]

        TaskService.update([input1, input2, input3, ''], importingRules);

        identical = (output, expectedOutput) => {
            for (key in output) {
                if (key !== '_id' && output[key] !== expectedOutput[key]) {
                    return false;
                }
            }
            return true;
        };

        test = () => {
            expectedOutput1 = {
                acctNum: 'Number1',
                facCode: 'Modified',
                ptType: '2',
                ptName: '3',
                dischrgDate: '4',
                fbDate: '5',
                acctBal: '6',
                finClass: '7',
                admitDate: '8',
                medNo: '9',
                insName: '10',
                insName2: '11',
                insName3: '12',
                insCode: '13',
                insCode2: '14',
                insCode3: '15',
                insBal: '16',
                insBal2: '17',
                insBal3: '18',
                state: 'active'
            };

            expectedOutput2 = {
                acctNum: 'Number2',
                facCode: '1',
                ptType: '2',
                ptName: 'Modified too',
                dischrgDate: '4',
                fbDate: '5',
                acctBal: '6',
                finClass: '7',
                admitDate: '8',
                medNo: '9',
                insName: '10',
                insName2: '11',
                insName3: '12',
                insCode: '13',
                insCode2: '14',
                insCode3: '15',
                insBal: '16',
                insBal2: '17',
                insBal3: '18',
                state: 'active'
            };

            expectedOutput3 = {
                acctNum: 'Number3',
                facCode: '1',
                ptType: '2',
                ptName: '3',
                dischrgDate: '4',
                fbDate: '5',
                acctBal: '6',
                finClass: '7',
                admitDate: '8',
                medNo: '9',
                insName: '10',
                insName2: '11',
                insName3: '12',
                insCode: '13',
                insCode2: '14',
                insCode3: '15',
                insBal: '16',
                insBal2: '17',
                insBal3: '18',
                state: 'archived'
            };
            const output1 = Tasks.findOne({acctNum: expectedOutput1.acctNum});
            const output2 = Tasks.findOne({acctNum: expectedOutput2.acctNum});
            const output3 = Tasks.findOne({acctNum: expectedOutput3.acctNum});

            return identical(output1, expectedOutput1) && identical(output2, expectedOutput2) && identical(output3, expectedOutput3);

        };

        // assert that test is true
        chai.assert(
            test() === true
        );
    });
});