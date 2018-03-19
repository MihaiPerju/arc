import Files from '/imports/api/files/collection';
import Facilities from '/imports/api/facilities/collection';
import Accounts from '/imports/api/tasks/collection';
import Backup from '/imports/api/backup/collection';
import stateEnum from "../../tasks/enums/states";
import {Substates} from "../../tasks/enums/substates";

export default class RevertService {

    //Main core of reverting
    static revert(fileId) {
        const {previousFileId, facilityId} = Files.findOne({_id: fileId});

        //Update accounts
        this.revertAccounts(fileId, previousFileId, facilityId);

        //Link facility to previous file
        this.revertFacility(facilityId, previousFileId);

        //Remove backups and files
        this.removeBackup(fileId);
    }

    static revertAccounts(fileId, previousFileId, facilityId) {
        const accounts = Accounts.find({facilityId, fileId}).fetch();

        _.map(accounts, (account) => {
            console.log(account);
            console.log("Will be reverted with:");
            const {acctNum} = account;
            const backUpAccount = Backup.findOne({acctNum, facilityId, fileId: previousFileId});
            console.log(backUpAccount);
            //If an account doesn't have previous backup - archive it
            if (!backUpAccount) {
                Accounts.update({acctNum}, {
                    $set: {
                        state: stateEnum.ARCHIVED,
                        substate: Substates.SELF_RETURNED
                    }
                });
            } else {
                //If an account has previous backup - revert everything except actions
                delete backUpAccount.actionsLinkData;
                delete backUpAccount.state;
                delete backUpAccount.substate;

                Accounts.update({acctNum}, {
                    $set: backUpAccount
                });
            }
        })
    }

    static revertFacility(_id, fileId) {
        Facilities.update({_id}, {
            $set: {
                fileId
            }
        });
    }

    static removeBackup(fileId) {
        Backup.remove({fileId});
    }
}
