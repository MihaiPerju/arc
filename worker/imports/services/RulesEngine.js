import Accounts from '/imports/api/accounts/collection';
import Rules from '/imports/api/rules/collection';
import FacilitySelector from '/imports/api/facilities/enums/selectors';
import Operators from '/imports/api/rules/enums/operators';
import ActionService from '/imports/api/accounts/server/services/ActionService';
import triggerTypes from '/imports/api/rules/enums/triggers';

export default class RulesEngine {
  static run (_id) {
    const account = Accounts.findOne ({_id});
    RulesEngine.solveAccount (account);
    //Clear pending status
    Accounts.update ({_id: account._id}, {$set: {isPending: false}});
  }

  static solveAccount = account => {
    let {clientId, facilityId} = account;

    //Getting indexed rules
    const rules = Rules.find ({clientId}).fetch ();

    for (let statement of rules) {
      if (statement.rule) {
        const isRuleRespected = RulesEngine.evaluate (account, statement.rule);
        if (isRuleRespected) {
          //Apply the actions as stated in the rule
          RulesEngine.applyChanges (account, statement);

          //See if the rule has stop condition
          if (statement.isBreakingLoop) {
            break;
          }
        }
      }
    }
  };

  static applyChanges (account, statement) {
    const {
      triggerType,
      actionId,
      assigneeId,
      workQueueId,
      editField,
      editValue,
    } = statement;

    //Decide what to do with the accounts
    switch (triggerType) {
      case triggerTypes.ACTION:
        ActionService.createSystemAction (actionId, account._id);
        break;
      case triggerTypes.EDIT:
        const updater = {};
        updater[editField] = editValue;
        Accounts.update ({_id: account._id}, {$set: updater});
        break;

      case triggerTypes.ASSIGN_USER:
        Accounts.update (
          {_id: account._id},
          {$set: {assigneeId}, $unset: {workQueue: null}}
        );
        break;
      case triggerTypes.ASSIGN_WORK_QUEUE:
        Accounts.update (
          {_id: account._id},
          {$set: {workQueueId}, $unset: {assigneeId: null}}
        );
        break;
    }
  }

  static evaluate (account, rule) {
    let {data} = rule;
    if (data) {
      //Start the first step recursively
      let expression = RulesEngine.recursiveCheck (data, account);

      //Convert and return the truth value
      const truthValue = eval (expression);
      return truthValue;
    }
  }

  static recursiveCheck (condition, account) {
    if (!condition.rules || (condition.rules && condition.rules.length === 1)) {
      //If there are no rules or it contains a single rule, add the condition itself
      const {combinator} = condition;
      if (combinator) {
        // condition = condition.rules[0];
        return RulesEngine.recursiveCheck (condition.rules[0], account);
      }
      const {field} = condition;
      return RulesEngine.evaluateComparison (account[field], condition);
    } else if (condition.rules.length > 1) {
      //Decide which conditional will be used in dependence of combinator
      const {combinator} = condition;
      const conditionalString = combinator === Operators.AND ? '&&' : '||';

      let expression = '(';

      // //Take the combinator and decide which filter to apply
      for (let index in condition.rules) {
        const rule = condition.rules[index];
        let expressionChunk = RulesEngine.recursiveCheck (rule, account);
        expression = expression + expressionChunk;
        if (index != condition.rules.length - 1) {
          expression += conditionalString;
        }
      }
      expression += ')';
      return expression;
    }
  }

  static evaluateComparison (valueToCompare, condition) {
    const {operator, value} = condition;
    const compareOperator = RulesEngine.convertSign (operator);
    // return eval(valueToCompare + compareOperator + value);
    if (valueToCompare && compareOperator && value) {
      return valueToCompare + compareOperator + value;
    }
    return true;
  }

  static convertSign (sign) {
    switch (sign) {
      case '=':
        return '===';
        break;
      case '!=':
        return '!==';
        break;
      case '<':
        return '<';
        break;
      case '<=':
        return '<=';
        break;
      case '>':
        return '>';
        break;
      case '>=':
        return '>=';
        break;
      default:
        break;
    }
  }
}
