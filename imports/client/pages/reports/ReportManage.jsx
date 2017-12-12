import React from 'react';
import {Container, Header, Divider, Button, Step} from 'semantic-ui-react'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import schema from '/imports/api/reports/schema'
import {roleGroups} from '/imports/api/users/enums/roles';
import TaskFilterBuilder from './TaskFilterBuilder';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import ReportsService from '../../../api/reports/services/ReportsService';

export default class ReportCreate extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null,
            hasGeneralInformation: false,
            generalInformation: {},
            allowedRoles: [],
        };
    }

    componentWillMount() {
        //Check if is in edit mode
        const reportId = FlowRouter.current().params.id;

        if (reportId) {
            Meteor.call('report.getById', reportId, (err, report) => {
                    if (!err) {
                        let components = {};

                        for (field in report.filterBuilderData) {
                            field = ReportsService.getInitialField(field);

                            components[field] = {
                                isActive: true,
                                name: field
                            }
                        }

                        const {name, allowedRoles, filterBuilderData} = report;

                        this.setState({
                            generalInformation: {
                                name,
                                allowedRoles
                            },
                            components,
                            filterBuilderData
                        });
                    }
                    else {
                        Notifier.error(err.reason);
                    }
                }
            )
        }

        let allowedRoles = [];
        roleGroups.ADMIN_TECH_MANAGER.map((role) => {
            allowedRoles.push({value: role, label: role});
        });
        this.setState({
            allowedRoles
        });
    }


    goNextStep() {
        this.setState({
            hasGeneralInformation: true
        });
    }

    goPreviousStep() {
        this.setState({
            hasGeneralInformation: false
        });
    }

    onSubmitGeneralData(generalInformation) {
        if (generalInformation.allowedRoles.length > 0) {
            this.setState({
                generalInformation,
                error: null
            });
            this.goNextStep();
        } else {
            this.setState({
                error: 'Select at least one allowed role!'
            });
        }
    }

    onSubmitFilters(filters, components, filterBuilderData) {
        //Setting state and creating/editing report
        this.setState({
            components,
            filterBuilderData
        });

        const {generalInformation} = this.state;
        _.extend(generalInformation, {mongoFilters: EJSON.stringify(filters), filterBuilderData});

        //If editing mode
        const reportId = this.props.id;

        if (reportId) {
            Meteor.call('report.update', {generalInformation, reportId}, (err) => {
                if (!err) {
                    Notifier.success("Report modified!");
                    FlowRouter.go('/reports/list');
                } else {
                    Notifier.error(err.reason);
                }
            })
        } else {
            // Create a report
            Meteor.call('report.create', generalInformation, (err) => {
                if (!err) {
                    Notifier.success("Report created");
                    FlowRouter.go('/reports/list');
                } else {
                    Notifier.error(err.reason);
                }
            })
        }
    }

    render() {
        const {hasGeneralInformation, allowedRoles, generalInformation, components, filterBuilderData} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">
                        Create report
                    </Header>

                    <Step.Group ordered>
                        <Step completed={hasGeneralInformation} active={!hasGeneralInformation}>
                            <Step.Content>
                                <Step.Title>General data</Step.Title>
                                <Step.Description>Select general data for report</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active={hasGeneralInformation}>
                            <Step.Content>
                                <Step.Title>Filters</Step.Title>
                                <Step.Description>Create filters for report</Step.Description>
                            </Step.Content>
                        </Step>

                    </Step.Group>
                    {
                        hasGeneralInformation
                            ?
                            <div>
                                <TaskFilterBuilder
                                    filterBuilderData={filterBuilderData}
                                    components={components}
                                    onSubmitFilters={this.onSubmitFilters.bind(this)}/>

                                <Divider/>

                                <Button
                                    fluid
                                    secondary
                                    onClick={this.goPreviousStep.bind(this)}>
                                    Back
                                </Button>
                            </div>
                            :
                            <AutoForm
                                model={generalInformation}
                                schema={schema}
                                onSubmit={this.onSubmitGeneralData.bind(this)} ref="form">

                                {this.state.error
                                    ? <div className="error">{this.state.error}</div>
                                    : ''
                                }

                                <AutoField name="name"/>
                                <ErrorField name="name"/>

                                <SelectField name="allowedRoles"
                                             options={allowedRoles}/>

                                <Divider/>

                                <Button primary fluid type="submit">
                                    Next
                                </Button>
                            </AutoForm>
                    }
                </div>
            </Container>
        )
    }
}