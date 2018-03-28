import React from 'react';
import {AutoForm, SelectField} from 'uniforms-semantic';
import ReportsService from '../../../api/reports/services/ReportsService';
import FilterSingle from './components/FilterSingle';
import Notifier from '/imports/client/lib/Notifier';
import assigneeQuery from '/imports/api/users/queries/listUsers';
import SimpleSchema from 'simpl-schema';
import Loading from '/imports/client/lib/ui/Loading';
import facilityNames from '/imports/api/facilities/queries/facilityListNames';

export default class TaskFilterBuilder extends React.Component {
    constructor() {
        super();
        this.state = {
            fullSchemaOptions: [],
            facilityOptions: [],
            assigneeOptions: [],
            components: {},
            loading: true,
            filters: {},
            schema: {}
        }
    }

    clearSchemaOptions = () => {
        const {components, fullSchemaOptions} = this.state;
        //Duplicating the full schema and remove used fields
        let schemaOptions = _.clone(fullSchemaOptions);

        for (component in components) {
            if (components[component].isActive) {
                for (option in schemaOptions) {
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
        const schema = ReportsService.createSchema();
        let fullSchemaOptions = ReportsService.getOptions();

        //Creating set of Components based on schema field types
        let {components} = this.props;
        if (!components) {
            components = ReportsService.getComponents();
        }

        //Getting assignee and facility options
        let facilityOptions = [], assigneeOptions = [];
        facilityNames.fetch((err, facilities) => {
            if (!err) {
                facilities.map((facility) => {
                    facilityOptions.push({
                        value: facility._id,
                        label: facility.name + " - " + facility.client.clientName
                    });
                    this.setState({facilityOptions});
                });
            } else {
                Notifier.error(err.reason);
            }
        });

        //Getting assignee options
        assigneeQuery.fetch((err, assignees) => {
            if (!err) {
                assignees.map((assignee) => {
                    assigneeOptions.push({value: assignee._id, label: assignee.profile.firstName});
                });
                this.setState({assigneeOptions});
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

    deleteFilter = (name) => {
        const {components} = this.state;

        components[name].isActive = false;

        this.setState({
            components
        });
    };

    onSubmit = (data) => {
        const {components} = this.state;
        const {onSubmitFilters} = this.props;
        const {result, filterBuilderData, error} = ReportsService.getFilters(data, components);

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
        const {components} = this.state;

        components[value] = {
            isActive: true,
            name: value
        };

        this.setState({
            components
        });
        this.refs.filterSelect.reset();
    };

    render() {
        const {loading, facilityOptions, assigneeOptions, components, schema} = this.state;
        const {filterBuilderData} = this.props;
        const schemaOptions = this.clearSchemaOptions();
        return (
            <div>
                <main className="cc-main">
                    {
                        loading ?
                            <Loading/> :
                            <div>
                                <AutoForm
                                    model={filterBuilderData}
                                    schema={schema}
                                    onSubmit={this.onSubmit}
                                    ref="filters">
                                    {
                                        _.map(components, (item) => {
                                            return item.isActive &&
                                                <FilterSingle
                                                    assigneeIdOptions={assigneeOptions}
                                                    facilityIdOptions={facilityOptions}
                                                    deleteFilter={this.deleteFilter}
                                                    name={item.name}
                                                />
                                        })
                                    }
                                </AutoForm>
                                <div className="add-report-filter">
                                    <AutoForm ref="filterSelect" onChange={this.createFilter} schema={filterSchema}>
                                        <SelectField options={schemaOptions} name="filter"/>
                                    </AutoForm>
                                </div>
                            </div>
                    }
                </main>
            </div>

        )
    }
}

const filterSchema = new SimpleSchema({
    filter: {
        type: String,
        label: false
    }
});
