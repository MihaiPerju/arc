import React, { Component } from "react";
import schema from "/imports/api/reports/schema";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import { EJSON } from "meteor/ejson";
import Notifier from "../../lib/Notifier";
import AccountFilterBuilder from "./AccountFilterBuilder";
import AccountActionFilterBuilder from "./AccountActionFilterBuilder";
import ReportTypeOptionsEnum, {
  reportTypes
} from "/imports/client/pages/reports/enums/reportType";

export default class ReportCreate extends Component {
  constructor() {
    super();
    this.state = {
      hasGeneralInformation: false,
      generalInformation: {},
      filterBuilderData: {},
      components: {},
      filter: false,
      shareReport: false,
      isDisabled: false
    };
  }

  onSubmitFilters = (filters, components, filterBuilderData) => {
    if (!filterBuilderData.facilityId && !filterBuilderData.clientId) {
      Notifier.error("Filters Should Include Client or Facility Filter");
      return;
    }
    //Setting state and creating/editing report
    this.setState({
      components,
      filterBuilderData,
      isDisabled: true
    });

    const { generalInformation, shareReport } = this.state;
    _.extend(generalInformation, {
      mongoFilters: EJSON.stringify(filters),
      filterBuilderData,
      shareReport
    });

    Meteor.call("report.create", generalInformation, err => {
      if (!err) {
        Notifier.success("Report created");
        this.onClose();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  };

  finish = () => {
    const filterBuilder = this.refs.filterBuilder;
    const filterForm = filterBuilder.refs.filters;
    filterForm.submit();
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleShareReport = () => {
    const { shareReport } = this.state;
    this.setState({ shareReport: !shareReport });
  };

  getOptions = () => {
    return ReportTypeOptionsEnum.map(type => ({
      value: type.value,
      label: type.label
    }));
  };

  onChangeModel = model => {
    //Not allowing to pick up filters if we don't have a name & report type
    let { generalInformation } = this.state;
    const newInformation = {};

    if (model.name && model.type) {
      this.setState({
        hasGeneralInformation: true
      });
    } else {
      this.setState({
        hasGeneralInformation: false
      });
    }

    if ("name" in model) {
      newInformation["name"] = model.name;
    }

    if ("type" in model) {
      newInformation["type"] = model.type;

      generalInformation = _.omit(
        generalInformation,
        "mongoFilters",
        "filterBuilderData"
      );
      this.setState({ components: {}, filterBuilderData: {} });
    }

    _.extend(generalInformation, generalInformation, newInformation);
    this.setState({ generalInformation });
  };

  render() {
    const {
      hasGeneralInformation,
      components,
      filterBuilderData,
      shareReport,
      generalInformation,
      isDisabled
    } = this.state;
    const { substates } = this.props;
    const options = this.getOptions();

    return (
      <div className="create-form">
        {/*Upper bar*/}
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            {hasGeneralInformation && (
              <button
                style={isDisabled ? { cursor: "not-allowed" } : {}}
                disabled={isDisabled}
                onClick={this.finish}
                className="btn--green"
              >
                {isDisabled ? (
                  <div>
                    {" "}
                    Loading
                    <i className="icon-cog" />
                  </div>
                ) : (
                  "Confirm & Save"
                )}
              </button>
            )}
          </div>
        </div>

        {/*Form with general data and filters*/}
        <div className="create-form__wrapper">
          {/*General data*/}
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">general data</div>
            </div>
            <AutoForm
              ref="generalDataForm"
              schema={schema}
              onChangeModel={this.onChangeModel}
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Report name"
                  name="name"
                />
                <ErrorField name="name" />
              </div>
              <div className="form-wrapper">
                <SelectField
                  labelHidden={true}
                  placeholder="Select type"
                  name="type"
                  options={options}
                />
                <ErrorField name="type" />
              </div>
              <div className="check-group">
                <input checked={shareReport} type="checkbox" />
                <label onClick={this.handleShareReport}>Share Reports</label>
              </div>
            </AutoForm>
          </div>
          {hasGeneralInformation && (
            //Filters section
            <div className="action-block">
              <div className="header__block">
                <div className="title-block text-uppercase">
                  Create fillters for report for{" "}
                  {generalInformation.type === reportTypes.ACCOUNTS
                    ? "Accounts"
                    : "Account Actions"}
                </div>
              </div>
              {generalInformation.type === reportTypes.ACCOUNTS ? (
                <AccountFilterBuilder
                  onSubmitFilters={this.onSubmitFilters.bind(this)}
                  filterBuilderData={filterBuilderData}
                  components={components}
                  substates={substates}
                  ref="filterBuilder"
                />
              ) : (
                <AccountActionFilterBuilder
                  onSubmitFilters={this.onSubmitFilters.bind(this)}
                  filterBuilderData={filterBuilderData}
                  components={components}
                  ref="filterBuilder"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
