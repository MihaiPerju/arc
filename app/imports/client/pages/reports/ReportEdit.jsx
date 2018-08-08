import React from "react";
import {
  AutoForm,
  AutoField,
  ErrorField,
  SelectField
} from "/imports/ui/forms";
import schema from "/imports/api/reports/schema";
import AccountFilterBuilder from "./AccountFilterBuilder";
import AccountActionFilterBuilder from "./AccountActionFilterBuilder";
import Notifier from "/imports/client/lib/Notifier";
import { EJSON } from "meteor/ejson";
import ReportsService from "../../../api/reports/services/ReportsService";
import AccountActionReportService from "../../../api/reports/services/AccountActionReportService";
import ReportTypeOptionsEnum, {
  reportTypes
} from "/imports/client/pages/reports/enums/reportType";
import AddReportColumn from "./AddReportColumn";

export default class ReportEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      hasGeneralInformation: true,
      generalInformation: {},
      filterBuilderData: {},
      components: {},
      filter: false,
      shareReport: false,
      isReportColumn: false,
      isDisabled: false
    };
  }

  componentWillMount() {
    this.initializeData(this.props);
  }

  componentWillReceiveProps = props => {
    this.initializeData(props);
  };

  initializeData = props => {
    const { report } = props;
    let components = {};
    const service =
      report.type === reportTypes.ACCOUNT_ACTIONS
        ? AccountActionReportService
        : ReportsService;

    for (let field in report.filterBuilderData) {
      field = service.getInitialField(field);
      components[field] = {
        isActive: true,
        name: field
      };
    }

    const { name, shareReport, filterBuilderData, type } = report;

    this.setState({
      generalInformation: {
        name,
        type
      },
      components,
      filterBuilderData,
      shareReport
    });
  };

  onChangeModel = model => {
    //Not allowing to pick up filters if we don't have a name & report type
    let { generalInformation } = this.state;
    const newInformation = {};
    const { report } = this.props;

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
      if (model.type === report.type) {
        this.initializeData(this.props);
      } else {
        generalInformation = _.omit(
          generalInformation,
          "mongoFilters",
          "filterBuilderData"
        );
        this.setState({ components: {}, filterBuilderData: {} });
      }
    }

    _.extend(generalInformation, generalInformation, newInformation);
    this.setState({ generalInformation });
  };

  onSubmitFilters(filters, components, filterBuilderData) {
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

    const { report } = this.props;
    const { _id } = report;
    Meteor.call("report.update", { generalInformation, _id }, err => {
      if (!err) {
        Notifier.success("Report modified!");
        this.onSetEdit();
      } else {
        Notifier.error(err.reason);
      }
      this.setState({ isDisabled: false });
    });
  }

  onSetEdit = () => {
    const { setEdit } = this.props;
    setEdit();
  };

  finish = () => {
    const filterBuilder = this.refs.filterBuilder;
    const filterForm = filterBuilder.refs.filters;
    filterForm.submit();
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

  openDialog = () => {
    this.setState({
      isReportColumn: true
    });
  };

  closeDialog = () => {
    this.setState({
      isReportColumn: false
    });
  };

  render() {
    const {
      hasGeneralInformation,
      shareReport,
      generalInformation,
      components,
      filterBuilderData,
      isReportColumn,
      isDisabled
    } = this.state;
    const { substates, report } = this.props;
    const options = this.getOptions();

    return (
      <div className="create-form">
        <div className="create-form__bar">
          <div className="btn-group">
            <button onClick={this.onSetEdit} className="btn-cancel">
              Cancel
            </button>
            <button
              style={isDisabled ? { cursor: "not-allowed" } : {}}
              disabled={isDisabled}
              onClick={this.finish}
              className="btn--green"
            >
              Confirm & save {isDisabled && <i className="icon-cog" />}
            </button>
          </div>
        </div>

        <div className="create-form__wrapper">
          {/*General data*/}
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">general data</div>
            </div>
            <AutoForm
              ref="generalDataForm"
              schema={schema}
              model={generalInformation}
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
            <div className="action-block">
              <div className="header__block">
                <div className="title-block text-uppercase">
                  Edit filters for report{" "}
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
          <div className="action-block">
            <div className="header__block">
              <div className="title-block text-uppercase">
                Add report column
              </div>
            </div>
            <div className="form-wrapper">
              <button
                style={{
                  background: "#fff",
                  padding: "17px 15px",
                  color: "#333",
                  width: "100%",
                  lineHeight: "1.6rem",
                  borderRadius: "3px",
                  borderBottom: "0"
                }}
                onClick={this.openDialog.bind(this)}
              >
                Add Column
              </button>
            </div>
            {isReportColumn && (
              <AddReportColumn closeDialog={this.closeDialog} report={report} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
