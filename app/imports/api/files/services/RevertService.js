import Files from '/imports/api/files/collection';
import Facilities from '/imports/api/facilities/collection';
import Accounts from '/imports/api/tasks/collection';
import Backup from '/imports/api/backup/collection';
import ActionService from "/imports/api/tasks/server/services/ActionService";
import AccountActions from '/imports/api/taskActions/collection';

export default class RevertService {

    //Main core of reverting
    static revert(fileId) {
        const {previousFileId, facilityId} = Files.findOne({_id: fileId});

        //Delete all system Actions applied after file upload
        this.revertSystemActions(fileId);
        //Update accounts
        this.revertAccounts(fileId, previousFileId, facilityId);

        //Link facility to previous file
        this.revertFacility(facilityId, previousFileId);

        //Remove backups and files
        this.removeBackup(fileId);
    }

    static revertSystemActions(fileId) {
        //find Id's of all actions that were applied automatically after file upload
        const accountActions = AccountActions.find({fileId}).fetch();
        let accountActionIds = [];
        _.each(accountActions, (accountAction) => {
            accountActionIds.push(accountAction._id);
        });

        //remove them from Accounts
        Accounts.update({actionsLinkData: {$in: accountActionIds}}, {
            $pull: {
                actionsLinkData: {
                    $in: accountActionIds
                }
            }
        });
    }

    static revertAccounts(fileId, previousFileId, facilityId) {
        const accounts = Accounts.find({facilityId, fileId}).fetch();

        _.map(accounts, (account) => {
            const {acctNum} = account;
            const backUpAccount = Backup.findOne({acctNum, facilityId, fileId: previousFileId});

            //If an account doesn't have previous backup - archive it
            if (!backUpAccount) {
                if (account.hasLastSysAction) {
                    ActionService.archive([acctNum], facilityId, fileId);
                }
            } else {
                //If an account has last action a system action then we need to delete state, substate.
                if (account.hasLastSysAction) {
                    //Delete the account state, substate and the fact that this change was triggered by the system.
                    delete account.state;
                    delete account.substate;
                    delete account.hasLastSysAction;
                } else {
                    //Actions are valid, so we don't need to update them.
                    delete backUpAccount.actionsLinkData;
                    delete backUpAccount.state;
                    delete backUpAccount.substate;
                    delete backUpAccount.hasLastSysAction;
                }

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
