import React from 'react';
import {Container, Dropdown, Header, Button} from 'semantic-ui-react'
import TaskSchema from '/imports/api/tasks/schema';
import {AutoForm, ErrorField, SelectField} from 'uniforms-semantic';
import ReportsService from './services/ReportsService';
import FilterSingle from './components/FilterSingle';

export default class TaskFilterBuilder extends React.Component {
    constructor() {
        super();
        this.state = {
            schemaOptions: [],
            components: {}
        }
    }

    componentWillMount() {

        //Getting schema keys
        let keys = TaskSchema._firstLevelSchemaKeys;

        //Getting options for Select Menu
        let schemaOptions = ReportsService.getOptions(keys);

        //Creating set of Components based on schema field types
        let components = ReportsService.getComponents(keys);

        this.setState({
            schemaOptions,
            components
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

    render() {
        const {schemaOptions, components} = this.state;
        return (
            <main className="cc-main">
                <Container className="page-container">
                    <Header as="h3">Select filters</Header>
                    <Dropdown onChange={this.selectFilter.bind(this)}
                              placeholder="Task fields"
                              options={schemaOptions}/>
                    {
                        _.map(components, (item) => {

                            return item.isActive &&
                                <FilterSingle
                                    deleteFilter={this.deleteFilter.bind(this)}
                                    name={item.name}/>
                        })
                    }

                    <Button primary fluid>Extract</Button>
                </Container>
            </main>
        )
    }
}