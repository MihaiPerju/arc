import SimpleSchema from "simpl-schema";
import FieldsType from "../../accounts/config/accounts";
import { StateList } from "/imports/api/accounts/enums/states";
import ReportFields from "/imports/api/reports/enums/ReportFields";

const stringMatchOptions = ["Contains", "Not Contains", "Is Exact"];

export default class ReportsService {
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
    ReportFields.map(rule => {
      const { value, label } = rule;
      schemaOptions.push({ label, value });
    });
    return schemaOptions;
  }

  static getComponents() {
    let components = {};

    ReportFields.map(key => {
      components[key] = {
        isActive: false,
        name: key
      };
    });

    return components;
  }

  static isEnum(name) {
    return FieldsType.enums.indexOf(name) !== -1;
  }

  static isDate(name) {
    return FieldsType.dates.indexOf(name) !== -1;
  }

  static isNumber(name) {
    return FieldsType.numbers.indexOf(name) !== -1;
  }

  static isLink(name) {
    return FieldsType.links.indexOf(name) !== -1;
  }

  static isString(name) {
    return FieldsType.strings.indexOf(name) !== -1;
  }

  static _createFilters(requiredFields, data) {
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
      if (ReportsService.isEnum(field)) {
        //If is Enum
        filters[field] = data[field];
      }
      if (ReportsService.isNumber(field)) {
        //If is Number
        filters[field] = {
          $gte: data[field + "Start"],
          $lt: data[field + "End"]
        };
      }
      if (ReportsService.isDate(field)) {
        //If is Date
        filters[field] = {
          $gte: data[field + "Start"],
          $lt: data[field + "End"]
        };
      }
      if (ReportsService.isString(field)) {
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
      } else if (ReportsService.isLink(field)) {
        filters[field] = { $in: data[field] };
      }
    }
    return { result: filters, filterBuilderData };
  }

  static getFilters(data, components) {
    const requiredFields = [];

    for (let component in components) {
      if (components[component].isActive) {
        if (ReportsService.isLink(component)) {
          requiredFields.push(component);
        } else if (ReportsService.isDate(component)) {
          requiredFields.push(`${component}Start`, `${component}End`);
        } else if (ReportsService.isNumber(component)) {
          requiredFields.push(`${component}Start`, `${component}End`);
        } else if (ReportsService.isEnum(component)) {
          requiredFields.push(component);
        } else if (ReportsService.isString(component)) {
          requiredFields.push(component, `${component}Match`);
        }
      }
    }

    //If we don't have filters
    if (requiredFields.length === 0) {
      return { result: "", error: "Select at least one filter!" };
    }

    const { result, filterBuilderData, error } = ReportsService._createFilters(
      requiredFields,
      data
    );

    if (error) {
      return { error };
    }

    return { result, filterBuilderData };
  }

  static createSchema(substates) {
    const fields = {};
    ReportFields.map(rule => {
      const { value, label } = rule;

      if (ReportsService.isString(value, FieldsType)) {
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
      } else if (ReportsService.isLink(value, FieldsType)) {
        fields[value] = {
          type: Array,
          optional: true,
          label
        };
        fields[`${value}.$`] = {
          type: String
        };
      } else if (ReportsService.isDate(value, FieldsType)) {
        fields[`${value}Start`] = {
          type: Date,
          optional: true,
          label
        };
        fields[`${value}End`] = {
          type: Date,
          optional: true
        };
      } else if (ReportsService.isNumber(value, FieldsType)) {
        fields[`${value}Start`] = {
          type: SimpleSchema.Integer,
          optional: true,
          label
        };
        fields[`${value}End`] = {
          type: SimpleSchema.Integer,
          optional: true
        };
      } else if (ReportsService.isEnum(value, FieldsType)) {
        let allowedValues;

        if (value === "state") {
          allowedValues = _.map(StateList, value => value);
        } else {
          allowedValues = _.map(substates, value => value.name);
        }

        fields[value] = {
          type: String,
          allowedValues,
          optional: true,
          label
        };
      }
    });
    return new SimpleSchema(fields);
  }
}
