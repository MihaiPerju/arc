import React from "react";
import AccountActionReportService from "../../../../api/reports/services/AccountActionReportService";
import {
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import inputTypesEnum from "/imports/api/actions/enums/inputTypeEnum";

export default class FiltersSingle extends React.Component {
  deleteFilter = name => {
    this.props.deleteFilter(name);
  };

  getOptions(name) {
    const { actionOptions, clientIdOptions, userOptions } = this.props;
    switch (name) {
      case "actionId":
        return actionOptions;
      case "userId":
        return userOptions;
      case "clientId":
        return clientIdOptions;
      default:
        return [];
    }
  }

  renderWidget(name) {
    if (AccountActionReportService.isEnum(name)) {
      return (
        <div className="select-wrapper m-t--0">
          <AutoField
            placeholder="Select filter"
            labelHidden={true}
            name={name}
          />
          <ErrorField name={name} />
        </div>
      );
    }
    if (AccountActionReportService.isDate(name)) {
      return (
        <div className="input-datetime">
          <AutoField
            placeholder="Select start date"
            labelHidden={true}
            name={`${name}Start`}
          />
          <ErrorField name={`${name}Start`} />

          <AutoField
            placeholder="Select finish date"
            labelHidden={true}
            name={`${name}End`}
          />
          <ErrorField name={`${name}End`} />
        </div>
      );
    }

    if (AccountActionReportService.isLink(name)) {
      return (
        <div className="check-group">
          <SelectField
            labelHidden={true}
            name={name}
            options={this.getOptions(name)}
          />
        </div>
      );
    }

    if (AccountActionReportService.isCustom(name)) {
      return (
        <div className="select-wrapper">
          <SelectMulti
            className="form-select__multi"
            placeholder="Select types"
            labelHidden={true}
            name={name}
            options={inputTypesEnum}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="form-wrapper__i">
          <AutoField
            labelHidden={true}
            placeholder="Type your filter"
            name={name}
          />
          <ErrorField name={name} />
        </div>
        <div className="select-wrapper">
          <AutoField
            labelHidden={true}
            placeholder="Select matching pattern"
            name={`${name}Match`}
          />
          <ErrorField name={`${name}Match`} />
        </div>
      </div>
    );
  }

  render() {
    const { name } = this.props;
    return (
      <div className="filter-type__wrapper">
        <div className="row-select">
          <div className="type text-light-grey">{name}</div>
          <div
            onClick={this.deleteFilter.bind(this, name)}
            className="btn-delete"
          >
            Delete
          </div>
        </div>
        {this.renderWidget(name)}
      </div>
    );
  }
}
