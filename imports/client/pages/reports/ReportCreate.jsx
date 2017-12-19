import React from 'react';
import {Container, Header, Divider, Button, Step} from 'semantic-ui-react'
import {AutoForm, AutoField, ErrorField, SelectField} from 'uniforms-semantic';
import schema from '/imports/api/reports/schema'
import {roleGroups} from '/imports/api/users/enums/roles';
import TaskFilterBuilder from './TaskFilterBuilder';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import ReportStepper from '/imports/client/pages/reports/components/ReportStepper';

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

        Meteor.call('report.create', generalInformation, (err) => {
            if (!err) {
                Notifier.success("Report created");
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
                        Create report
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