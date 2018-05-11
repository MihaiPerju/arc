import TaskService from '/imports/api/facilities/server/services/TaskImportingService';
import {chai} from 'meteor/practicalmeteor:chai';
import Tasks from '/imports/api/accounts/collection';
import {resetDatabase} from 'meteor/xolvio:cleaner';

describe('Import inventory files', function () {

    beforeEach(function () {
        resetDatabase();
    });

    it("Must update old documents and insert new documents", function () {

        const input1 = [
            ['AcnxX49kFFBTDxF5m', 'N', 'N', '0', '01/02/2018', '12/02/2015', '0', '0', '12/02/2015',
                '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
            ''
        ];
        const input2 = [
            ['AcnxX49kFFBTDxF5m', 'M', 'M', '4', '01/02/2018', '12/02/2015', '7', '8', '12/02/2015',
                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
            ''
        ];

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
        const facilityId = 'abcdefghijklmnop';
        TaskService.upload(input1, importingRules, facilityId);
        TaskService.update(input2, importingRules, facilityId);

        const account = Tasks.findOne();

        //Delete date fields + id for easy checking
        delete account.fbDate;
        delete account.admitDate;
        delete account.dischrgDate;
        delete account.createdAt;
        delete account._id;

        const expectedAccount = {
            facilityId: 'abcdefghijklmnop',
            acctNum: 'AcnxX49kFFBTDxF5m',
            facCode: 'M',
            ptType: 'M',
            ptName: 4,
            acctBal: 7,
            finClass: 8,
            medNo: 10,
            insName: 11,
            insName2: 12,
            insName3: 13,
            insCode: 14,
            insCode2: 15,
            insCode3: 16,
            insBal: 17,
            insBal2: 18,
            insBal3: 19,
            metaData: {
                Meta1: 'metavalue1',
                Meta2: 'metavalue2'
            },
            state: 'Active',
            substate: 'new'
        };

        test = () => {
            for (key in account) {
                if (account[key] != expectedAccount[key]) {
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