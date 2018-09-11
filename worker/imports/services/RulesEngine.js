import Accounts from "/imports/api/accounts/collection";
import Rules from "/imports/api/rules/collection";
import FacilitySelector from "/imports/api/facilities/enums/selectors";

export default class RulesEngine {
  static run() {
    //Get the pending accounts
    const accounts = Accounts.find({ isPending: true }).fetch();
    for (let account of accounts) {
      RulesEngine.solveAccount(account);

      //Clear pending status
      // Accounts.update({_id:account._id},{$set:{isPending:false}});
    }
  }

  static solveAccount = account => {
    let { clientId, facilityId } = account;

    //To be streamed instead of simple fetching
    const rules = Rules.find({ clientId }).fetch();

    for (let statement of rules) {
      // RulesEngine.compareAccount(account, rule);
      if (statement.rule) {
        RulesEngine.evaluate(account, statement.rule);
      }
    }
  };

  /////////////////CONVERTOR

  static evaluate(account, rule) {
    let expression = "true";
    let { data } = rule;
    if (data) {
      //Start the first step recursively
      expression = RulesEngine.recursiveCheck(data, account);
      const truthValue = eval(expression);
      if (truthValue) {
        console.log("TRUE. ACTION THE ACCOUNT!");
      } else {
        console.log("FALSE. DON'T ACTION THE ACCOUNT!");
      }
    }
  }

  static recursiveCheck(condition, account) {
    if (!condition.rules || (condition.rules && condition.rules.length === 1)) {
      //If there are no rules or it contains a single rule, add the condition itself
      const { combinator } = condition;
      if (combinator) {
        condition = condition.rules[0];
      }
      const { field } = condition;
      return RulesEngine.evaluateComparison(account[field], condition);
    } else if (condition.rules.length > 1) {
      console.log("COMPOUND CONDITION");
      // //Decide which conditional will be used in dependence of combinator
      // const { combinator } = condition;
      // const conditionalString = combinator === Operators.AND ? "$and" : "$or";

      // //Prepare the array of conditions

      // //Take the combinator and decide which filter to apply
      // for (let rule of condition.rules) {
      //   let ruleFilters = {};
      //   this.addFilter(rule, ruleFilters);
      // }
    }
  }

  static evaluateComparison(valueToCompare, condition) {
    const { operator, value } = condition;
    const compareOperator = RulesEngine.convertSign(operator);

    return eval(valueToCompare + compareOperator + value);
  }

  static convertSign(sign) {
    switch (sign) {
      case "=":
        return "===";
        break;

      default:
        break;
    }
  }
}
