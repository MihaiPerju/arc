import SimpleSchema from "simpl-schema";
import accountActionsFieldsType from "../../accounts/config/accountActions";
import { accountActionsFields } from "/imports/api/reports/enums/ReportFields";
import { typeList } from "/imports/api/accounts/enums/actionTypesEnum";

const stringMatchOptions = ["Contains", "Not Contains", "Is Exact"];

export default class AccountActionReportsService {
  static getInitialField(field) {
    if (field.endsWith("Match")) {
      field = field.substring(0, field.indexOf("Match"));
    } else if (field.endsWith("End")) {
      field = field.substring(0, field.indexOf("End"));
    } else if (field.endsWith("Start")) {
      field = field.substring(0, field.indexOf("Start"));
    }
    return field;
  }

  static getOptions() {
    let schemaOptions = [{ label: "+ Add Filter" }];
    accountActionsFields.map(rule => {
      const { value, label } = rule;
      schemaOptions.push({ label, value });
    });
    return schemaOptions;
  }

  static getComponents() {
    let components = {};

    accountActionsFields.map(key => {
      components[key] = {
        isActive: false,
        name: key
      };
    });

    return components;
  }

  static isEnum(name) {
    return accountActionsFieldsType.enums.indexOf(name) !== -1;
  }

  static isDate(name) {
    return accountActionsFieldsType.dates.indexOf(name) !== -1;
  }

  static isLink(name) {
    return accountActionsFieldsType.links.indexOf(name) !== -1;
  }

  static isString(name) {
    return accountActionsFieldsType.strings.indexOf(name) !== -1;
  }

  static isCustom(name) {
    return accountActionsFieldsType.custom.indexOf(name) !== -1;
  }

  static _createFilters(requiredFields, data, filteredActions) {
    //Creating filters
    let filters = {};
    let filterBuilderData = {};

    for (let field of requiredFields) {
      //Field not completed
      if (!data[field]) {
        return { error: "Filters uncomplete!" };
      }
      filterBuilderData[field] = data[field];

      //Removing 'Start' and 'End' prefixes if they are
      if (field.endsWith("Start")) {
        field = field.substr(0, field.indexOf("Start"));
      }
      if (field.endsWith("End")) {
        field = field.substr(0, field.indexOf("End"));
      }

      //Check type and create filter based on specific type information
      if (AccountActionReportsService.isEnum(field)) {
        //If is Enum
        filters[field] = data[field];
      }
      if (AccountActionReportsService.isDate(field)) {
        //If is Date
        filters[field] = {
          $gte: data[field + "Start"],
          $lt: data[field + "End"]
        };
      }
      if (AccountActionReportsService.isString(field)) {
        //If is a string
        if (data[field + "Match"] === stringMatchOptions[0]) {
          filters[field] = { $regex: data[field], $options: "i" };
        } else if (data[field + "Match"] === stringMatchOptions[1]) {
          filters[field] = {
            $regex: `^((?!${data[field]}).)*$`,
            $options: "i"
          };
        } else {
          filters[field] = data[field];
        }
      } else if (AccountActionReportsService.isLink(field)) {
        filters[field] = { $in: data[field] };
      }

      if (AccountActionReportsService.isCustom(field)) {
        filters["actionId"] = { $in: filteredActions };
      }
    }
    return { result: filters, filterBuilderData };
  }

  static getFilters(data, components, filteredActions) {
    const requiredFields = [];

    for (let component in components) {
      if (components[component].isActive) {
        if (AccountActionReportsService.isLink(component)) {
          requiredFields.push(component);
        } else if (AccountActionReportsService.isDate(component)) {
          requiredFields.push(`${component}Start`, `${component}End`);
        } else if (AccountActionReportsService.isEnum(component)) {
          requiredFields.push(component);
        } else if (AccountActionReportsService.isString(component)) {
          requiredFields.push(component, `${component}Match`);
        } else if (AccountActionReportsService.isCustom(component)) {
          requiredFields.push(component);
        }
      }
    }

    //If we don't have filters
    if (requiredFields.length === 0) {
      return { result: "", error: "Select at least one filter!" };
    }

    const {
      result,
      filterBuilderData,
      error
    } = AccountActionReportsService._createFilters(requiredFields, data, filteredActions);

    if (error) {
      return { error };
    }

    return { result, filterBuilderData };
  }

  static createSchema() {
    const fields = {};
    accountActionsFields.map(rule => {
      const { value, label } = rule;

      if (
        AccountActionReportsService.isString(value, accountActionsFieldsType)
      ) {
        fields[value] = {
          type: String,
          optional: true,
          label
        };
        fields[`${value}Match`] = {
          type: String,
          allowedValues: stringMatchOptions,
          optional: true
        };
      } else if (
        AccountActionReportsService.isLink(value, accountActionsFieldsType)
      ) {
        fields[value] = {
          type: Array,
          optional: true,
          label
        };
        fields[`${value}.$`] = {
          type: String
        };
      } else if (
        AccountActionReportsService.isDate(value, accountActionsFieldsType)
      ) {
        fields[`${value}Start`] = {
          type: Date,
          optional: true,
          label
        };
        fields[`${value}End`] = {
          type: Date,
          optional: true
        };
      } else if (
        AccountActionReportsService.isEnum(value, accountActionsFieldsType)
      ) {
        const allowedValues = _.map(typeList, value => value);

        fields[value] = {
          type: String,
          allowedValues,
          optional: true,
          label
        };
      } else if (
        AccountActionReportsService.isCustom(value, accountActionsFieldsType)
      ) {
        fields[value] = {
          type: Array,
          optional: true
        };
        fields[`${value}.$`] = {
          type: String
        };
      }
    });
    return new SimpleSchema(fields);
  }
}
