import SimpleSchema from "simpl-schema";
import FieldsType from "../../accounts/config/accounts";
import ReportFields from "/imports/api/reports/enums/ReportFields";
import moment from "moment";


const stringMatchOptions = ["Contains", "Not Contains", "Is Exact"];

export default class ReportsService {
  static getInitialField(field) {
    if (field.endsWith("Match")) {
      field = field.substring(0, field.indexOf("Match"));
    } else if (field.endsWith("End")) {
      field = field.substring(0, field.indexOf("End"));
    } else if (field.endsWith("Start")) {
      field = field.substring(0, field.indexOf("Start"));
    } else if (field.endsWith("DateSpan")) {
      field = field.substring(0, field.indexOf("DateSpan"));
    } else if (field.endsWith("Chkbox")) {
      field = field.substring(0, field.indexOf("Chkbox"));
    }
    return field;
  }

  static getOptions() {
    let schemaOptions = [{
      label: "+ Add Filter"
    }];
    ReportFields.map(rule => {
      const {
        value,
        label
      } = rule;
      schemaOptions.push({
        label,
        value
      });
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
      if (field.indexOf("Start") === -1 && field.indexOf("End") === -1 && field.indexOf("DateSpan") === -1 && field.indexOf("Chkbox") === -1) {
        if (!data[field]) {
          return {
            error: "Filters uncomplete!"
          };
        }
      }

      filterBuilderData[field] = data[field];

      //Removing 'Start' and 'End' prefixes if they are
      if (field.endsWith("Start")) {
        field = field.substr(0, field.indexOf("Start"));
      }
      if (field.endsWith("End")) {
        field = field.substr(0, field.indexOf("End"));
      }
      if (field.endsWith("DateSpan")) {
        field = field.substr(0, field.indexOf("DateSpan"));
      }
      if (field.endsWith("Chkbox")) {
        field = field.substr(0, field.indexOf("Chkbox"));
      }

      //Check type and create filter based on specific type information
      if (ReportsService.isEnum(field)) {
        //If is Enum
        filters[field] = {
          $in: data[field]
        };
      }
      if (ReportsService.isNumber(field)) {
        //If is Number
        if (data[field + "Start"] && data[field + "End"]) {
          filters[field] = {
            $gte: data[field + "Start"],
            $lt: data[field + "End"]
          };
        } else if (data[field + "Start"]) {
          filters[field] = {
            $gte: data[field + "Start"]
          };
        } else if (data[field + "End"]) {
          filters[field] = {
            $lt: data[field + "End"]
          };
        } else {
          return {
            error: "Atleast one field is required!"
          };
        }
      }
      if (ReportsService.isDate(field)) {
        let isRelativeDateSpan = data[field + "Chkbox"];
        if (isRelativeDateSpan) {
          filters[field] = ReportsService.getQuery(data[field + "DateSpan"])
        } else if (data[field + "Start"] && data[field + "End"]) {
          filters[field] = {
            $gte: data[field + "Start"],
            $lt: data[field + "End"]
          };
        } else if (data[field + "Start"]) {
          filters[field] = {
            $gte: data[field + "Start"]
          };
        } else if (data[field + "End"]) {
          filters[field] = {
            $lt: data[field + "End"]
          };
        } else {
          return {
            error: "Atleast one field is required!"
          };
        }
      }
      if (ReportsService.isString(field)) {
        //If is a string
        if (data[field + "Match"] === stringMatchOptions[0]) {
          filters[field] = {
            $regex: data[field],
            $options: "i"
          };
        } else if (data[field + "Match"] === stringMatchOptions[1]) {
          filters[field] = {
            $regex: `^((?!${data[field]}).)*$`,
            $options: "i"
          };
        } else {
          filters[field] = data[field];
        }
      } else if (ReportsService.isLink(field)) {
        filters[field] = {
          $in: data[field]
        };
      }
    }
    return {
      result: filters,
      filterBuilderData
    };
  }

  static getQuery(getSpan) {
    let query = {};
    let dateTimeNow = moment();
    let today = new Date(dateTimeNow);
    let yesterday = new Date(dateTimeNow.add(-1, 'days'));
    switch (getSpan) {
      case 'today':
        query = { $eq: today };
        return query;
      case 'yesterday':
        query = { $eq: yesterday };
        return query;
      case 'last_week':
        let lastWeekStartDate = new Date(moment().subtract(1, 'weeks').startOf('isoWeek'));
        let lastWeekEndDate = new Date(moment().subtract(1, 'weeks').endOf('isoWeek'));
        query = {
          $gte: lastWeekStartDate,
          $lt: lastWeekEndDate
        };
        return query;
      case 'last_month':
        let lastMonthStartDate = new Date(moment().subtract(1, 'months').startOf('month'));
        let lastMonthEndDate = new Date(moment().subtract(1, 'months').endOf('month'));
        query = {
          $gte: lastMonthStartDate,
          $lt: lastMonthEndDate
        };
        return query;
      case 'last_year':
        let lastYearStartDate = new Date(moment().subtract(1, 'years').startOf('year'));
        let lastYearEndDate = new Date(moment().subtract(1, 'years').endOf('year'));
        query = {
          $gte: lastYearStartDate,
          $lt: lastYearEndDate
        };
        return query;
      case 'week_to_date':
        let thisWeekStartDate = new Date(moment().subtract(0, 'weeks').startOf('isoWeek'));
        let thisWeekEndDate = today;
        query = {
          $gte: thisWeekStartDate,
          $lt: thisWeekEndDate
        };
        return query;
      case 'month_to_date':
        let thisMonthStartDate = new Date(moment().subtract(0, 'months').startOf('month'));
        let thisMonthEndDate = today;
        query = {
          $gte: thisMonthStartDate,
          $lt: thisMonthEndDate
        };
        return query;
      case 'year_to_date':
        let thisYearStartDate = new Date(moment().subtract(0, 'years').startOf('year'));
        let thisYearEndDate = today;
        query = {
          $gte: thisYearStartDate,
          $lt: thisYearEndDate
        };
        return query;
      default:
        query = { $eq: today };
        return query;
    }
  }

  static getFilters(data, components) {
    const requiredFields = [];
    for (let component in components) {
      if (components[component].isActive) {
        if (ReportsService.isLink(component)) {
          requiredFields.push(component);
        } else if (ReportsService.isDate(component)) {
          requiredFields.push(`${component}Start`, `${component}End`, `${component}DateSpan`, `${component}Chkbox`);
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
      return {
        result: "",
        error: "Select at least one filter!"
      };
    }

    const {
      result,
      filterBuilderData,
      error
    } = ReportsService._createFilters(
      requiredFields,
      data
    );

    if (error) {
      return {
        error
      };
    }

    return {
      result,
      filterBuilderData
    };
  }

  static createSchema(substates) {
    const fields = {};
    ReportFields.map(rule => {
      const {
        value,
        label
      } = rule;

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
        fields[`${value}DateSpan`] = {
          type: String,
          optional: true
        };
        fields[`${value}Chkbox`] = {
          type: String,
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
        fields[value] = {
          type: SimpleSchema.oneOf(String, Array),
          optional: true,
          label,
        };
      }
    });
    return new SimpleSchema(fields);
  }
}