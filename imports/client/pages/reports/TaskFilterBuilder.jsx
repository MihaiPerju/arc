import React from 'react';
import {Container, Dropdown, Header, Button, Segment, Divider} from 'semantic-ui-react'
import TaskSchema from '/imports/api/tasks/schema';
import {AutoForm, SelectField} from 'uniforms-semantic';
import ReportsService from '../../../api/reports/services/ReportsService';
import FilterSingle from './components/FilterSingle';
import Notifier from '/imports/client/lib/Notifier';
import facilityQuery from '/imports/api/facilities/queries/facilityList';
import assigneeQuery from '/imports/api/users/queries/listUsers';
import TaskReportFields from '../../../api/tasks/config/tasks';
import stateEnum from '/imports/api/tasks/enums/states';
import {Substates} from '/imports/api/tasks/enums/substates';
import SimpleSchema from 'simpl-schema';

export default class TaskFilterBuilder extends React.Component {
    constructor() {
        super();
        this.state = {
            schemaOptions: [],
            components: {},
            facilityOptions: [],
            assigneeOptions: [],
            filters: {},
            schema: {}
        }
    }

    componentWillMount() {
        //Getting schema keys
        let keys = TaskSchema._firstLevelSchemaKeys;
        //also,remove field "createdAt", "actionsLinkData", "attachmentIds"
        keys.splice(keys.indexOf('createdAt'), 1);
        keys.splice(keys.indexOf('metaData'), 1);
        keys.splice(keys.indexOf('actionsLinkData'), 1);
        keys.splice(keys.indexOf('attachmentIds'), 1);

        //Creating schema
        const schema = ReportsService.createSchema(keys, TaskReportFields, {stateEnum, substateEnum: Substates});

        //Getting options for Select Menu
        let schemaOptions = ReportsService.getOptions(keys);

        //Creating set of Components based on schema field types
        let {components} = this.props;
        if (!components) {
            components = ReportsService.getComponents(keys);
        }

        //Clearing schemaOptions if in editing mode
        for (component in components) {
            if (components[component].isActive) {
                for (option in schemaOptions) {
                    if (schemaOptions[option].text === component) {
                        schemaOptions.splice(option, 1);
                    }
                }
            }
        }

        //Getting assignee and facility options
        let facilityOptions = [], assigneeOptions = [];

        //Getting facility options
        Meteor.call('facility.getNames', (err, facilities) => {
            if (!err) {
                facilities.map((facility) => {
                    facilityOptions.push({value: facility._id, label: facility.name});
                });
                this.setState({facilityOptions});
            } else {
                Notifier.error(err.reason);
            }
        });

        //Getting assignee options
        assigneeQuery.fetch((err, assignees) => {
            if (!err) {
                assignees.map((assignee) => {
                    assigneeOptions.push({value: assignee._id, label: assignee._id});
                });
                this.setState({assigneeOptions});
            } else {
                Notifier.error(err.reason);
            }
        });

        this.setState({
            schemaOptions,
            components,
            schema
        });
    }

    deleteFilter = (name) => {
        const {components, schemaOptions} = this.state;

        components[name].isActive = false;
        schemaOptions.push({value: name, text: name});

        this.setState({
            components,
            schemaOptions
        });
    }

    onSubmit(data) {
        const {components} = this.state;
        const {onSubmitFilters} = this.props;
        const {result, filterBuilderData, error} = ReportsService.getFilters(data, components, TaskReportFields);

        if (error) {
            Notifier.error(error);
        } else {
            onSubmitFilters(result, components, filterBuilderData);
            this.setState({
                filters: result
            });
        }
    }

    createFilter = (field, value) => {
        const {components, schemaOptions} = this.state;

        components[value] = {
            isActive: true,
            name: value
        };

        schemaOptions.map((option) => {
            if (option.value === value) {
                console.log(option.value);
                console.log(value);
                schemaOptions.splice(schemaOptions.indexOf(option), 1);
            }
        });
        this.setState({
            components,
            schemaOptions
        });
        this.refs.filterSelect.reset();
    };

    render() {
        const {filters, facilityOptions, assigneeOptions, schemaOptions, components, schema} = this.state;
        const {filterBuilderData} = this.props;

        return (
            <main className="cc-main">
                <AutoForm
                    model={filterBuilderData}
                    schema={schema}
                    onSubmit={this.onSubmit.bind(this)}
                    ref="form">
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
                    <Button primary fluid type="submit">
                        Finish
                    </Button>
                    <Segment tertiary>
                        <div>Extracted filters:{JSON.stringify(filters)}</div>
                    </Segment>
                </AutoForm>
                <div className="add-filter text-center">
                    <AutoForm ref="filterSelect" onChange={this.createFilter} schema={filterSchema}>
                        <SelectField options={schemaOptions} name="filter"/>
                    </AutoForm>
                </div>
            </main>
        )
    }
}

const filterSchema = new SimpleSchema({
    filter: {
        type: String,
        label: false
    }
});
