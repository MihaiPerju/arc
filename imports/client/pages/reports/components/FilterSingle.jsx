import React from 'react';
import {Segment, Button} from 'semantic-ui-react'
import ReportsService from './../services/ReportsService';
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';

export default class FiltersSingle extends React.Component {
    constructor() {
        super();
    }

    deleteFilter(name) {
        this.props.deleteFilter(name);
    }

    getOptions() {
        const {name, assigneeIdOptions, facilityIdOptions} = this.props;
        return name === 'assigneeId' ? assigneeIdOptions : facilityIdOptions;
    }

    render() {
        const {name, keys} = this.props;

        return (
            <Segment>

                {name && name.charAt(0).toUpperCase() + name.slice(1)}

                {
                    ReportsService.isEnum(name, keys) ?
                        <div>
                            <AutoField name={name}/>
                            <ErrorField name={name}/>
                        </div>
                        :
                        ReportsService.isDate(name, keys) ?
                            <div>
                                <AutoField name={`${name}Start`}/>
                                <ErrorField name={`${name}Start`}/>

                                <AutoField name={`${name}End`}/>
                                <ErrorField name={`${name}End`}/>
                            </div>
                            :
                            ReportsService.isNumber(name, keys) ?
                                <div>
                                    <AutoField name={`${name}Start`}/>
                                    <ErrorField name={`${name}Start`}/>

                                    <AutoField name={`${name}End`}/>
                                    <ErrorField name={`${name}End`}/>
                                </div>
                                :
                                ReportsService.isLink(name, keys) ?
                                    <div>
                                        <SelectField name={name} options={this.getOptions(name)}/>
                                    </div>
                                    : <div>
                                        <AutoField name={name}/>
                                        <ErrorField name={name}/>

                                        <AutoField name={`${name}Match`}/>
                                        <ErrorField name={`${name}Match`}/>
                                    </div>

                }

                <Button onClick={this.deleteFilter.bind(this, name)}
                        floated='right'
                        color="red">
                    Delete
                </Button>
            </Segment>
        )
    }
}
