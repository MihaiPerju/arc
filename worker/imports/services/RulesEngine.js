import Accounts from '/imports/api/accounts/collection';
import Rules from '/imports/api/rules/collection';
import FacilitySelector from '/imports/api/facilities/enums/selectors';
import Operators from '/imports/api/rules/enums/operators';
import ActionService from '/imports/api/accounts/server/services/ActionService';
import triggerTypes from '/imports/api/rules/enums/triggers';
import moment from 'moment';

export default class RulesEngine {
  static run(_id) {
    const account = Accounts.findOne({
      _id
    });
    RulesEngine.solveAccount(account);
    //Clear pending status
    Accounts.update({
      _id: account._id
    }, {
      $set: {
        isPending: false
      }
    });
  }

  static solveAccount = account => {
    let {
      clientId,
      facilityId
    } = account;

    //Getting indexed rules
    const rules = Rules.find({
      clientId
    }).fetch();

    for (let statement of rules) {
      if (statement.rule) {
        const isRuleRespected = RulesEngine.evaluate(account, statement.rule);
        if (isRuleRespected) {
          //Apply the actions as stated in the rule
          RulesEngine.applyChanges(account, statement);

          //See if the rule has stop condition
          if (statement.isBreakingLoop) {
            break;
          }
        }
      }
    }
  };

  static applyChanges(account, statement) {
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
        ActionService.createSystemAction(actionId, account._id);
        break;
      case triggerTypes.EDIT:
        const updater = {};
        updater[editField] = editValue;
        Accounts.update({
          _id: account._id
        }, {
          $set: updater
        });
        break;

      case triggerTypes.ASSIGN_USER:
        Accounts.update({
          _id: account._id
        }, {
          $set: {
            assigneeId
          },
          $unset: {
            workQueue: null
          }
        });
        break;
      case triggerTypes.ASSIGN_WORK_QUEUE:
        Accounts.update({
          _id: account._id
        }, {
          $set: {
            workQueueId
          },
          $unset: {
            assigneeId: null
          }
        });
        break;
    }
  }

  static evaluate(account, rule) {
    let {
      data
    } = rule;
    if (data) {
      //Start the first step recursively
      let expression = RulesEngine.recursiveCheck(data, account);
      //Convert and return the truth value
      const truthValue = eval(expression);
      return truthValue;
    }
  }

  static recursiveCheck(condition, account) {
    if (!condition.rules || (condition.rules && condition.rules.length === 1)) {
      //If there are no rules or it contains a single rule, add the condition itself
      const {
        combinator
      } = condition;
      if (combinator) {
        // condition = condition.rules[0];
        return RulesEngine.recursiveCheck(condition.rules[0], account);
      }
      const {
        field
      } = condition;
      return RulesEngine.evaluateCondition(account, field, condition);
    } else if (condition.rules.length > 1) {
      //Decide which conditional will be used in dependence of combinator
      const {
        combinator
      } = condition;
      const conditionalString = combinator === Operators.AND ? '&&' : '||';

      let expression = '(';

      // //Take the combinator and decide which filter to apply
      for (let index in condition.rules) {
        const rule = condition.rules[index];
        let expressionChunk = RulesEngine.recursiveCheck(rule, account);
        expression = expression + expressionChunk;
        if (index != condition.rules.length - 1) {
          expression += conditionalString;
        }
      }
      expression += ')';
      return expression;
    }
  }

  static evaluateCondition(account, field, condition) {
    const {
      operator,
      value
    } = condition;
    //See if account has 'field' property
    if (!account.hasOwnProperty(field)) {
      if (operator === '!') {
        return true;
      } else if (operator === '!!') {
        return false;
      }
    } else {
      //evaluate other conditions
      const valueToCompare = account[field];

      if (!parseInt(value) && !parseInt(valueToCompare) && moment(valueToCompare).isValid() && moment(value).isValid()) {
        //date case - return moment comparison function as result
        return RulesEngine.evaluateDateComparison(
          operator,
          value,
          valueToCompare
        );
      } else {
        //cases except dates
        return RulesEngine.evaluateDefaultComparison(
          operator,
          value,
          valueToCompare
        );
      }
    }
  }

  static evaluateDateComparison(operator, value, valueToCompare) {
    switch (operator) {
      case '=':
        return moment(value)
          .startOf('day')
          .isSame(moment(valueToCompare).startOf('day'));
        break;
      case '!=':
        return !moment(value)
          .startOf('day')
          .isSame(moment(valueToCompare).startOf('day'));
        break;
      case '>':
        return moment(valueToCompare)
          .startOf('day')
          .isAfter(moment(value).startOf('day'));
        break;
      case '>=':
        return (
          moment(valueToCompare)
          .startOf('day')
          .isAfter(moment(value).startOf('day')) ||
          moment(value)
          .startOf('day')
          .isSame(moment(valueToCompare).startOf('day'))
        );
        break;
      case '<':
        return moment(value)
          .startOf('day')
          .isAfter(moment(valueToCompare).startOf('day'));
        break;
      case '<=':
        return (
          moment(value)
          .startOf('day')
          .isAfter(moment(valueToCompare).startOf('day')) ||
          moment(value)
          .startOf('day')
          .isSame(moment(valueToCompare).startOf('day'))
        );
        break;
      case '!':
        return false;
        break;
      case '!!':
        return true;
        break;
      default:
        return false;
        break;
    }
  }

  static evaluateDefaultComparison(operator, value, valueToCompare) {
    switch (operator) {
      case '=':
        return valueToCompare == value;
        break;
      case '!=':
        return valueToCompare != value;
        break;
      case 'contains':
        return valueToCompare.toUpperCase().includes(value.toUpperCase());
        break;
      case 'startsWith':
        return valueToCompare.toUpperCase().startsWith(value.toUpperCase());
        break;
      case 'endsWith':
        return valueToCompare.toUpperCase().endsWith(value.toUpperCase());
        break;
      case '!':
        return false;
        break;
      case '!!':
        return true;
        break;
      default:
        return valueToCompare + operator + value;
        break;
    }
  }
}