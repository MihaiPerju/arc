import React from 'react';
import {Container, Dropdown, Header, Button, Segment} from 'semantic-ui-react'
import TaskSchema from '/imports/api/tasks/schema';
import {AutoForm, ErrorField, SelectField} from 'uniforms-semantic';
import ReportsService from './services/ReportsService';
import FilterSingle from './components/FilterSingle';
import FilterBuilderSchema from '/imports/api/tasks/schemas/filterBuilderSchema';
import Notifier from '/imports/client/lib/Notifier';
import facilityQuery from '/imports/api/facilities/queries/facilityList';
import assigneeQuery from '/imports/api/users/queries/listUsers';

export default class TaskFilterBuilder extends React.Component {
    constructor() {
        super();
        this.state = {
            schemaOptions: [],
            components: {},
            keys: [],
            facilityOptions: [],
            assigneeOptions: [],
            filters: {}
        }
    }

    componentWillMount() {

        //Getting schema keys
        let keys = TaskSchema._firstLevelSchemaKeys;

        //Removing last 2 keys
        keys.pop();
        keys.pop();

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
            keys
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
        const {result, error} = ReportsService.getFilters(data, components);
        if (error) {
            Notifier.error(error);
        } else {
            this.setState({
                filters: result
            });
        }
    }

    render() {
        const {filters, facilityOptions, assigneeOptions, schemaOptions, components, keys} = this.state;
        return (
            <main className="cc-main">
                <Container className="page-container">
                    <Header as="h3">Select filters</Header>
                    <Dropdown onChange={this.selectFilter.bind(this)}
                              placeholder="Task fields"
                              options={schemaOptions}/>
                    <AutoForm
                        schema={FilterBuilderSchema}
                        onSubmit={this.onSubmit.bind(this)}
                        ref="form">
                        {
                            _.map(components, (item) => {

                                return item.isActive &&
                                    <FilterSingle
                                        assigneeIdOptions={assigneeOptions}
                                        facilityIdOptions={facilityOptions}
                                        deleteFilter={this.deleteFilter.bind(this)}
                                        keys={keys}
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

