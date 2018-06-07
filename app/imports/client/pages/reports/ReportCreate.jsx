import React, { Component } from "react";
import Roles from "../../../api/users/enums/roles";
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

export default class ReportCreate extends Component {
  constructor() {
    super();
    this.state = {
      hasGeneralInformation: false,
      generalInformation: {},
      filterBuilderData: {},
      components: {},
      filter: false,
      shareReport: false
    };
  }

  //When changing name or role of the filter
  onChange = (field, value) => {
    let { generalInformation } = this.state;

    //Not allowing to pick up filters if we don't have a name
    if (field === "name") {
      if (value) {
        this.setState({
          hasGeneralInformation: true
        });
      } else {
        this.setState({
          hasGeneralInformation: false
        });
      }
    }
    const newInformation = {};
    newInformation[field] = value;
    _.extend(generalInformation, generalInformation, newInformation);
    this.setState({ generalInformation });
  };

  onSubmitFilters = (filters, components, filterBuilderData) => {
    //Setting state and creating/editing report
    this.setState({
      components,
      filterBuilderData
    });

    const { generalInformation, shareReport } = this.state;
    _.extend(generalInformation, {
      mongoFilters: EJSON.stringify(filters),
      filterBuilderData,
      shareReport
    });

    Meteor.call('report.create', generalInformation, (err) => {
        if (!err) {
            Notifier.success('Report created');
            this.onClose();
        } else {
            Notifier.error(err.reason);
        }
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

  render() {
    const { hasGeneralInformation, components, filterBuilderData, shareReport } = this.state;
    const { substates } = this.props;

    return (
      <div className="create-form">
        {/*Upper bar*/}
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onClose} className="btn-cancel">
              Cancel
            </button>
            {hasGeneralInformation && (
              <button onClick={this.finish} className="btn--green">
                Confirm & save
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
              onChange={this.onChange}
              ref="generalDataForm"
              schema={schema}
            >
              <div className="form-wrapper">
                <AutoField
                  labelHidden={true}
                  placeholder="Report name"
                  name="name"
                />
                <ErrorField name="name" />
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
                  Create fillters for report
                </div>
              </div>
              {hasGeneralInformation && (
                <AccountFilterBuilder
                  onSubmitFilters={this.onSubmitFilters.bind(this)}
                  filterBuilderData={filterBuilderData}
                  components={components}
                  substates={substates}
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
