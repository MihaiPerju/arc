import React from 'react';
import {Container, Header, Divider, Button} from 'semantic-ui-react'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import schema from '/imports/api/reports/schema'
import RolesEnum from '/imports/api/users/enums/roles';
import TaskFilterBuilder from './TaskFilterBuilder';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import ReportsService from '../../../api/reports/services/ReportsService';
import ReportStepper from '/imports/client/pages/reports/components/ReportStepper';

export default class ReportEdit extends React.Component {
    constructor() {
        super();

        this.state = {
            hasGeneralInformation: false,
            generalInformation: {},
            allowedRoles: [],
        };
    }

    componentWillMount() {
        const reportId = this.props.id;

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
        );

        let allowedRoles = [{value: RolesEnum.MANAGER, label: RolesEnum.MANAGER}];
        this.setState({
            allowedRoles
        })
    }

    goNextStep(generalInformation) {
        this.setState({
            hasGeneralInformation: true,
            generalInformation
        });
    }

    goPreviousStep() {
        this.setState({
            hasGeneralInformation: false
        });
    }

    onSubmitFilters(filters, components, filterBuilderData) {
        //Setting state and creating/editing report
        this.setState({
            components,
            filterBuilderData
        });

        const {generalInformation} = this.state;
        _.extend(generalInformation, {mongoFilters: EJSON.stringify(filters), filterBuilderData});

        const reportId = this.props.id;

        Meteor.call('report.update', {generalInformation, reportId}, (err) => {
            if (!err) {
                Notifier.success("Report modified!");
                FlowRouter.go('/reports/list');
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    render() {
        const {hasGeneralInformation, allowedRoles, generalInformation, components, filterBuilderData} = this.state;

        return (
            <Container className="page-container">
                <div>
                    <Header as="h2" textAlign="center">
                        Edit report
                    </Header>

                    <ReportStepper hasGeneralInformation={hasGeneralInformation}/>

                    {hasGeneralInformation
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
                            onSubmit={this.goNextStep.bind(this)} ref="form">

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