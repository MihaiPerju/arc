import React from "react";
import { AutoForm, SelectField } from "uniforms-unstyled";
import ReportsService from "../../../api/reports/services/ReportsService";
import FilterSingle from "./components/FilterSingle";
import Notifier from "/imports/client/lib/Notifier";
import assigneeQuery from "/imports/api/users/queries/listUsers";
import SimpleSchema from "simpl-schema";
import Loading from "/imports/client/lib/ui/Loading";
import { Meteor } from "meteor/meteor";

export default class AccountFilterBuilder extends React.Component {
  constructor() {
    super();
    this.state = {
      fullSchemaOptions: [],
      facilityOptions: [],
      assigneeOptions: [],
      clientOptions: [],
      substateOptions: [],
      components: {},
      loading: true,
      filters: {},
      schema: {}
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
    const { substates } = this.props;
    const schema = ReportsService.createSchema(substates);
    let fullSchemaOptions = ReportsService.getOptions();
    //Creating set of Components based on schema field types
    let { components } = this.props;
    if (!components) {
      components = ReportsService.getComponents();
    }

    //Generating substate options
    let substateOptions = _.map(substates, substate => ({
      label: substate.name,
      value: substate.name
    }));

    this.setState({ substateOptions });

    //Getting assignee and facility options
    let facilityOptions = [],
      assigneeOptions = [],
      clientOptions = [];
    const { filterBuilderData } = this.props;

    if (filterBuilderData.clientId) {
      this.getProperFacilities(filterBuilderData.clientId);
    } else {
      Meteor.call("facilities.getEssential", (err, facilities) => {
        if (!err) {
          facilities.map(facility => {
            facilityOptions.push({
              value: facility._id,
              label:
                facility.name + " - " + facility.client &&
                facility.client.clientName
            });
            this.setState({ facilityOptions });
          });
        } else {
          Notifier.error(err.reason);
        }
      });
    }

    //Getting assignee options
    assigneeQuery.fetch((err, assignees) => {
      if (!err) {
        assignees.map(assignee => {
          assigneeOptions.push({
            value: assignee._id,
            label: assignee.profile.firstName
          });
        });
        this.setState({ assigneeOptions });
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

    if (name === "clientId") {
      this.getProperFacilities([]);
    }

    this.setState({
      components
    });
  };

  onSubmit = data => {
    const { components } = this.state;
    const { onSubmitFilters } = this.props;
    const { result, filterBuilderData, error } = ReportsService.getFilters(
      data,
      components
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

  onHandleChange = (field, value) => {
    if (field === "clientId") {
      this.getProperFacilities(value);
    }
  };

  getProperFacilities = clientIds => {
    let facilityOptions = [];

    if (clientIds.length !== 0) {
      Meteor.call(
        "facilities.getEssential",
        { clientId: { $in: clientIds } },
        (err, facilities) => {
          if (!err) {
            facilities.map(facility => {
              facilityOptions.push({
                value: facility._id,
                label: facility.name + " - " + facility.client.clientName
              });
            });
            this.setState({ facilityOptions });
          } else {
            Notifier.error(err.reason);
          }
        }
      );
    } else {
      let facilityOptions = [];
      Meteor.call("facilities.getEssential", (err, facilities) => {
        if (!err) {
          facilities.map(facility => {
            facilityOptions.push({
              value: facility._id,
              label: facility.name + " - " + facility.client.clientName
            });
          });
          this.setState({ facilityOptions });
        } else {
          Notifier.error(err.reason);
        }
      });
    }
  };

  render() {
    const {
      loading,
      facilityOptions,
      assigneeOptions,
      components,
      schema,
      clientOptions,
      substateOptions
    } = this.state;
    const { filterBuilderData } = this.props;
    const schemaOptions = this.clearSchemaOptions();
    return (
      <div className="arcc-form-wrap">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <AutoForm
              model={filterBuilderData}
              schema={schema}
              onSubmit={this.onSubmit}
              ref="filters"
              onChange={this.onHandleChange}
            >
              {_.map(components, item => {
                return (
                  item.isActive && (
                    <FilterSingle
                      assigneeIdOptions={assigneeOptions}
                      facilityIdOptions={facilityOptions}
                      clientIdOptions={clientOptions}
                      substateOptions={substateOptions}
                      deleteFilter={this.deleteFilter}
                      name={item.name}
                      filterData={filterBuilderData}
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
        )}
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
