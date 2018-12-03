import Actions from "/imports/api/actions/collection";
import Substates from "/imports/api/substates/collection";

// WTH do we have a class with nothing but static functions?!?!?!.... I hope this was just CoC garbage
// Also why is none of this documented? We are just passing a "data" var down?..... I hate this file....
export default class ActionService {
  static createAction(data) {
    const { substateId } = data;
    const { stateName } = Substates.findOne({ _id: substateId }) || {};
    data.state = stateName;

    const actionId = Actions.insert(data);
    if (data.substateId) {
      this.pushActionId({ actionId, substateId });
    }

    return actionId;
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
}