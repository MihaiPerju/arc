import AccountService from '/imports/api/facilities/server/services/AccountImportingService';
import {chai} from 'meteor/practicalmeteor:chai';
import Accounts from '/imports/api/accounts/collection';
import {resetDatabase} from 'meteor/xolvio:cleaner';

describe('Import header placement files', function () {

    beforeEach(function () {
        resetDatabase();
    });

    it("Must create correct accounts with Metadata", function () {

        const input = [
            ['Account Number', 'Fac Code', 'Pt Type', 'Pt Name', 'Discharge Date', 'Fb Date',
                'Account Balance', 'Fin Class', 'Admit Date', 'Med No', 'Ins Name', 'Ins Name 2',
                'Ins Name 3', 'Ins Code', 'Ins Code 2', 'Ins Code 3', 'Modified', 'Ins Balance 2',
                'Ins Balance 3', 'Meta1', 'Meta2'],
            ['AcnxX49kFFBTDxF5m', 'M', 'M', '4', '01/02/2018', '12/02/2015', '7', '8', '12/02/2015',
                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 'metavalue1', 'metavalue2'],
            ''
        ];

        const importRules = {
            "hasHeader": true,
            "acctNum": "Account Number",
            "facCode": "Fac Code",
            "ptType": "Pt Type",
            "ptName": "Pt Name",
            "dischrgDate": "Discharge Date",
            "fbDate": "Fb Date",
            "acctBal": "Account Balance",
            "finClass": "Fin Class",
            "admitDate": "Admit Date",
            "medNo": "Med No",
            "insName": "Ins Name",
            "insName2": "Ins Name 2",
            "insName3": "Ins Name 3",
            "insCode": "Ins Code",
            "insCode2": "Ins Code 2",
            "insCode3": "Ins Code 3",
            "insBal": "Modified",
            "insBal2": "Ins Balance 2",
            "insBal3": "Ins Balance 3"
        };
        const facilityId = 'abcdefghijklmnop';
        AccountService.upload(input, importRules, facilityId);
        const account = Accounts.findOne();

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
            if (JSON.stringify(account.metaData) !== JSON.stringify(expectedAccount.metaData)) {
                return false;
            }
            delete account.metaData;
            delete expectedAccount.metaData;
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