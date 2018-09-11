//IMPORTANT: TO BE CHANGED TO CHECK ON ACCOUNTS RATHER THAN CONVERT TO MONGO FILTERS

import Operators from "../enums/operators";


export default class FilterBuilder {
  static convert(rule) {
    let filters = {};
    let parentFilter = rule.data;
    if (parentFilter) {
      //Start the first step recursively
      this.addFilter(parentFilter, filters);
    }
    return filters;
  }

  static addFilter(condition, filters) {
    if (!condition.rules || (condition.rules && condition.rules.length === 1)) {
      //If there are no rules or it contains a single rule, add the condition itself
      const { combinator } = condition;
      if (combinator) {
        condition = condition.rules[0];
      }

      const { field } = condition;
      filters[field] = this.getMongoFilter(condition);
    } else if (condition.rules.length > 1) {
      //Decide which conditional will be used in dependence of combinator
      const { combinator } = condition;
      const conditionalString = combinator === Operators.AND ? "$and" : "$or";

      //Prepare the array of conditions
      filters[conditionalString] = [];

      //Take the combinator and decide which filter to apply
      for (let rule of condition.rules) {
        let ruleFilters = {};
        this.addFilter(rule, ruleFilters);
        filters[conditionalString].push(ruleFilters);
      }
    }
  }

  static getMongoFilter({ operator, value }) {
    return value;
  }
}
