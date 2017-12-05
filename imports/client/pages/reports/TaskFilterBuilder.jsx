import React from 'react';
import {Container, Dropdown, Header, Button, Segment, Divider} from 'semantic-ui-react'
import TaskSchema from '/imports/api/tasks/schema';
import {AutoForm, ErrorField, SelectField} from 'uniforms-semantic';
import ReportsService from './services/ReportsService';
import FilterSingle from './components/FilterSingle';
import Notifier from '/imports/client/lib/Notifier';
import facilityQuery from '/imports/api/facilities/queries/facilityList';
import assigneeQuery from '/imports/api/users/queries/listUsers';
import TaskReportFields from './config/tasks';
import stateEnum from '/imports/api/tasks/enums/states';
import {Substates} from '/imports/api/tasks/enums/substates';

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

        //Removing last 2 keys
        keys.pop();
        keys.pop();

        const schema = ReportsService.createSchema(keys, TaskReportFields, {stateEnum, substateEnum: Substates});

        //Getting options for Select Menu
        let schemaOptions = ReportsService.getOptions(keys);

        //Creating set of Components based on schema field types
        let components = ReportsService.getComponents(keys);

        //Getting assignee and facility options
        let facilityOptions = [], assigneeOptions = [];

        //Getting facility options
        facilityQuery.fetch((err, facilities) => {
            if (!err) {
                facilities.map((facility) => {
                    facilityOptions.push({value: facility._id, label: facility._id});
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

    selectFilter(e, data) {
        const {components, schemaOptions} = this.state;

        components[data.value].isActive = true;
        schemaOptions.map((option) => {
            if (option.text === data.value) {
                schemaOptions.splice(schemaOptions.indexOf(option), 1);
            }
        });
        this.setState({
            components,
            schemaOptions
        });
    }

    deleteFilter(name) {
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
        const {result, error} = ReportsService.getFilters(data, components, TaskReportFields);
        if (error) {
            Notifier.error(error);
        } else {
            this.setState({
                filters: result
            });
        }
    }

    render() {
        const {filters, facilityOptions, assigneeOptions, schemaOptions, components, schema} = this.state;
        return (
            <main className="cc-main">
                <Container className="page-container">
                    <Header as="h3">Select filters</Header>
                    <Dropdown onChange={this.selectFilter.bind(this)}
                              placeholder="Task fields"
                              options={schemaOptions}/>

                    <Divider/>

                    <AutoForm
                        schema={schema}
                        onSubmit={this.onSubmit.bind(this)}
                        ref="form">
                        {
                            _.map(components, (item) => {

                                return item.isActive &&
                                    <FilterSingle
                                        assigneeIdOptions={assigneeOptions}
                                        facilityIdOptions={facilityOptions}
                                        deleteFilter={this.deleteFilter.bind(this)}
                                        name={item.name}
                                    />
                            })
                        }
                        <Button primary fluid type="submit">
                            Extract
                        </Button>
                        <Segment tertiary>
                            {
                                <div>Extracted filters:{JSON.stringify(filters)}</div>
                            }
                        </Segment>
                    </AutoForm>
                </Container>
            </main>
        )
    }
}

