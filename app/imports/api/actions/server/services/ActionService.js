import Actions from "/imports/api/actions/collection";
import Substates from "/imports/api/substates/collection";
import Letter from "/imports/api/letters/collection";
import AccountActions from "/imports/api/accountActions/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import Accounts from "/imports/api/accounts/collection";

export default class ActionService {
  static createAction(data) {
    const { substateId } = data;
    const { stateName } = Substates.findOne({ _id: substateId });
    data.state = stateName;

    const actionId = Actions.insert(data);
    if (data.substateId) {
      this.pushActionId({ actionId, substateId });
    }
  }

  static editAction({ _id, title, description, substateId, inputs }) {
    const action = Actions.findOne({ _id });
    const previousSubstateId = action.substateId;
    Actions.update(
      { _id },
      {
        $set: {
          title,
          description,
          substateId,
          inputs
        }
      }
    );

    if (previousSubstateId !== substateId) {
      this.updateActionId({ actionId: _id, substateId, previousSubstateId });
    }
  }

  static updateActionId({ actionId, substateId, previousSubstateId }) {
    if (previousSubstateId && substateId) {
      this.pullActionId({ previousSubstateId, actionId });
      this.pushActionId({ actionId, substateId });
    } else if (!previousSubstateId) {
      this.pushActionId({ actionId, substateId });
    } else if (!substateId) {
      this.pullActionId({ previousSubstateId, actionId });
    }
  }

  static pushActionId({ actionId, substateId }) {
    Substates.update({ _id: substateId }, { $push: { actionIds: actionId } });
  }

  static pullActionId({ previousSubstateId, actionId }) {
    Substates.update(
      { _id: previousSubstateId },
      { $pull: { actionIds: actionId } }
    );
  }

  static createLetter(data) {
    const { userId, accountId, letterTemplateId } = data;
    const letterData = {
      userId,
      type: actionTypesEnum.LETTER,
      createdAt: new Date(),
      accountId,
      letterTemplateId
    };
    Letter.insert(data);
    const accountActionId = AccountActions.insert(letterData);

    Accounts.update(
      { _id: accountId },
      {
        $push: {
          letterIds: accountActionId
        }
      }
    );
  }
}
