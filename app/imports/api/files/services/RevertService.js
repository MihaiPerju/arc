import Files from "/imports/api/files/collection";
import Facilities from "/imports/api/facilities/collection";
import Accounts from "/imports/api/accounts/collection";
import Backup from "/imports/api/backup/collection";
import ActionService from "/imports/api/accounts/server/services/ActionService";
import AccountActions from "/imports/api/accountActions/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";

export default class RevertService {
  //Main core of reverting
  static revert(fileId) {
    const file = Files.findOne({ _id: fileId });
    if (file) {
      const { facilityId, createdAt } = file;

      //Get all the files uploaded earlier
      const files = Files.find(
        { createdAt: { $gte: createdAt }, facilityId },
        { sort: { createdAt: -1 } }
      );
      for (let file of files) {
        this.revertFile(file);
        Files.remove({ _id: file._id });
      }
    } else {
      throw new Meteor.Error("Could not delete file.");
    }
  }

  static revertFile(file) {
    const { _id, previousFileId, facilityId, fileName } = file;

    //Delete all system Actions applied after file upload
    this.revertSystemActions(_id);
    //Update accounts
    this.revertAccounts(_id, previousFileId, facilityId, fileName);

    //Link facility to previous file
    this.revertFacility(facilityId, previousFileId);

    //Remove backups and files
    this.removeBackup(_id);
  }

  static revertSystemActions(fileId) {
    //find Id's of all actions that were applied automatically after file upload
    const accountActions = AccountActions.find({ fileId }).fetch();
    let accountActionIds = [];
    _.each(accountActions, accountAction => {
      accountActionIds.push(accountAction._id);
    });

    //remove them from Accounts
    Accounts.update(
      { actionIds: { $in: accountActionIds } },
      {
        $pull: {
          actionIds: {
            $in: accountActionIds
          }
        }
      }
    );
  }

  static revertAccounts(fileId, previousFileId, facilityId, fileName) {
    const accounts = Accounts.find({ facilityId, fileId }).fetch();
    const { clientId } = Facilities.findOne({ _id: facilityId });
    const revertFile = {
      type: actionTypesEnum.REVERT,
      createdAt: new Date(),
      fileId,
      fileName,
      clientId,
      userId: clientId
    };
    const accountActionId = AccountActions.insert(revertFile);

    Facilities.update(
      { _id: facilityId },
      {
        $push: {
          fileIds: accountActionId
        }
      }
    );

    _.map(accounts, account => {
      const { acctNum } = account;
      const backUpAccount = Backup.findOne({
        acctNum,
        facilityId,
        fileId: previousFileId
      });

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
          delete backUpAccount.actionIds;
          delete backUpAccount.state;
          delete backUpAccount.substate;
          delete backUpAccount.hasLastSysAction;
        }

        Accounts.update(
          { acctNum },
          {
            $set: backUpAccount
          }
        );
      }
    });
  }

  static revertFacility(_id, fileId) {
    Facilities.update(
      { _id },
      {
        $set: {
          fileId
        }
      }
    );
  }

  static removeBackup(fileId) {
    Backup.remove({ fileId });
  }
}
