import React from "react";
import { AutoForm, SelectField } from "uniforms-unstyled";
import AccountActionReportService from "../../../api/reports/services/AccountActionReportService";
import AccountActionFilterSingle from "./components/AccountActionFilterSingle";
import Notifier from "/imports/client/lib/Notifier";
import SimpleSchema from "simpl-schema";
import Loading from "/imports/client/lib/ui/Loading";

export default class AccountFilterBuilder extends React.Component {
  constructor() {
    super();
    this.state = {
      fullSchemaOptions: [],
      components: {},
      loading: true,
      filters: {},
      schema: {},
      actionOptions: [],
      userOptions: [],
      filteredActions: [],
      clientOptions: [],
    };
  }

  clearSchemaOptions = () => {
    const { components, fullSchemaOptions } = this.state;
    //Duplicating the full schema and remove used fields
    let schemaOptions = _.clone(fullSchemaOptions);

    for (let component in components) {
      if (components[component].isActive) {
        for (let option in schemaOptions) {
          if (schemaOptions[option].value === component) {
            schemaOptions.splice(option, 1);
          }
        }
      }
    }
    return schemaOptions;
  };

  componentWillMount() {
    //Creating schema for filters
    const schema = AccountActionReportService.createSchema();
    let fullSchemaOptions = AccountActionReportService.getOptions();

    //Creating set of Components based on schema field types
    let { components } = this.props;
    if (!components) {
      components = AccountActionReportService.getComponents();
    }

    //Getting actions and user options
    const actionOptions = [],
      userOptions = [],
      clientOptions = [];

    // Getting actions options
    Meteor.call("actions.get", (err, actions) => {
      if (!err) {
        actions.map(action => {
          actionOptions.push({
            value: action._id,
            label: action.title
          });
        });
        this.setState({ actionOptions });
      } else {
        Notifier.error(err.reason);
      }
    });

    // Getting user options
    Meteor.call("users.get", (err, users) => {
      if (!err) {
        users.map(user => {
          const { profile, _id } = user;
          userOptions.push({
            value: _id,
            label: `${profile.firstName} ${profile.lastName}`
          });
        });
        this.setState({ userOptions });
      } else {
        Notifier.error(err.reason);
      }
    });

    //Getting client options
    Meteor.call("clients.getEssential", (err, clients) => {
      if (!err) {
        clients.map(client => {
          clientOptions.push({ value: client._id, label: client.clientName });
        });
        this.setState({ clientOptions });
      } else {
        Notifier.error(err.reason);
      }
    });

    this.setState({
      fullSchemaOptions,
      loading: false,
      components,
      schema
    });
  }

  deleteFilter = name => {
    const { components } = this.state;

    components[name].isActive = false;

    this.setState({
      components
    });
  };

  onSubmit = data => {
    const { components, filteredActions } = this.state;
    const { onSubmitFilters } = this.props;

    const {
      result,
      filterBuilderData,
      error
    } = AccountActionReportService.getFilters(
      data,
      components,
      filteredActions
    );

    if (error) {
      Notifier.error(error);
    } else {
      onSubmitFilters(result, components, filterBuilderData);
      this.setState({
        filters: result
      });
    }
  };

  createFilter = (field, value) => {
    const { components } = this.state;

    components[value] = {
      isActive: true,
      name: value
    };

    this.setState({
      components
    });
    this.refs.filterSelect.reset();
  };

  onChange = (field, value) => {
    if (field === "inputs") {
      this.getFilteredActions(value);
    }
  };

  getFilteredActions = inputs => {
    Meteor.call(
      "actions.get",
      { filters: { "inputs.type": { $in: inputs } } },
      (err, actions) => {
        if (!err) {
          const filteredActions = actions.map(action => action._id);
          this.setState({ filteredActions });
        } else {
          Notifier.error(err.reason);
        }
      }
    );
  };

  render() {
    const {
      loading,
      components,
      schema,
      actionOptions,
      userOptions,
      clientOptions
    } = this.state;
    const { filterBuilderData } = this.props;
    const schemaOptions = this.clearSchemaOptions();

    if (loading) {
      return <Loading />;
    }
    return (
      <div className="arcc-form-wrap">
        <div>
          <AutoForm
            model={filterBuilderData}
            schema={schema}
            onSubmit={this.onSubmit}
            ref="filters"
            onChange={this.onChange}
          >
            {_.map(components, item => {
              return (
                item.isActive && (
                  <AccountActionFilterSingle
                    deleteFilter={this.deleteFilter}
                    name={item.name}
                    clientIdOptions={clientOptions}
                    actionOptions={actionOptions}
                    userOptions={userOptions}
                  />
                )
              );
            })}
          </AutoForm>
          <div className="add-report-filter">
            <AutoForm
              ref="filterSelect"
              onChange={this.createFilter}
              schema={filterSchema}
            >
              <SelectField options={schemaOptions} name="filter" />
            </AutoForm>
          </div>
        </div>
      </div>
    );
  }
}

const filterSchema = new SimpleSchema({
  filter: {
    type: String,
    label: false
  }
});
