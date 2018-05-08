import React from 'react';
import {AutoForm, AutoField, ErrorField, SelectField} from '/imports/ui/forms';
import schema from '/imports/api/reports/schema'
import RolesEnum from '/imports/api/users/enums/roles';
import TaskFilterBuilder from './TaskFilterBuilder';
import Notifier from '/imports/client/lib/Notifier';
import {EJSON} from 'meteor/ejson'
import ReportsService from '../../../api/reports/services/ReportsService';

export default class ReportEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            hasGeneralInformation: true,
            generalInformation: {},
            filterBuilderData: {},
            components: {},
            filter: false,
        };
    }

    componentWillMount() {
        this.initializeData(this.props);
    }

    componentWillReceiveProps = (props) => {
        this.initializeData(props);
    };

    initializeData = (props) => {
        const {report} = props;
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

        this.setState({
            allowedRoles: [{value: RolesEnum.MANAGER, label: RolesEnum.MANAGER}]
        })
    }

    onChange = (field, value) => {
        let {generalInformation} = this.state;

        //Not allowing to pick up filters if we don't have a name
        if (field === 'name') {
            if (value) {
                this.setState({
                    hasGeneralInformation: true,
                })
            } else {
                this.setState({
                    hasGeneralInformation: false
                })
            }
        }
        const newInformation = {};
        newInformation[field] = value;
        _.extend(generalInformation, generalInformation, newInformation);
        this.setState({generalInformation});

    };

    onSubmitFilters(filters, components, filterBuilderData) {
        //Setting state and creating/editing report
        this.setState({
            components,
            filterBuilderData
        });

        const {generalInformation} = this.state;
        _.extend(generalInformation, {mongoFilters: EJSON.stringify(filters), filterBuilderData});

        const {report} = this.props;
        const {_id} = report;
        Meteor.call('report.update', {generalInformation, _id}, (err) => {
            if (!err) {
                Notifier.success("Report modified!");
                this.onSetEdit();
            } else {
                Notifier.error(err.reason);
            }
        })
    }

    onSetEdit = () => {
        const {setEdit} = this.props;
        setEdit();
    };

    finish = () => {
        const filterBuilder = this.refs.filterBuilder;
        const filterForm = filterBuilder.refs.filters;
        filterForm.submit();
    };

    render() {
        const {hasGeneralInformation, allowedRoles, generalInformation, components, filterBuilderData} = this.state;
        const {substates} = this.props;
        return (
            <div className="create-form">
                <div className="create-form__bar">
                    <div className="btn-group">
                        <button onClick={this.onSetEdit} className="btn-cancel">Cancel</button>
                        <button onClick={this.finish} className="btn--green">Confirm & save</button>
                    </div>
                </div>

                <div className="create-form__wrapper">
                    {/*General data*/}
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">general data</div>
                        </div>
                        <AutoForm onChange={this.onChange}
                                  ref="generalDataForm"
                                  schema={schema}
                                  model={generalInformation}>
                            <div className="form-wrapper">
                                <AutoField labelHidden={true} placeholder="Report name" name="name"/>
                                <ErrorField name="name"/>
                            </div>
                            <div className="check-group">
                                <SelectField
                                    labelHidden={true}
                                    options={allowedRoles}
                                    name="allowedRoles"
                                    ref="allowedRoles"/>
                            </div>
                        </AutoForm>
                    </div>
                    {
                        hasGeneralInformation &&
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">Edit filters for report</div>
                            </div>
                            <TaskFilterBuilder
                                onSubmitFilters={this.onSubmitFilters.bind(this)}
                                filterBuilderData={filterBuilderData}
                                components={components}
                                substates={substates}
                                ref="filterBuilder"/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}