import React, {Component} from 'react';
import Roles from "../../../api/users/enums/roles";
import schema from "/imports/api/reports/schema";
import {AutoForm, AutoField, ErrorField, SelectField} from "/imports/ui/forms";
import {EJSON} from "meteor/ejson";
import Notifier from "../../lib/Notifier";
import TaskFilterBuilder from './TaskFilterBuilder';

export default class ReportCreate extends Component {
    constructor() {
        super();
        this.state = {
            hasGeneralInformation: false,
            generalInformation: {},
<<<<<<< HEAD
            allowedRoles: [{value: Roles.MANAGER, label: Roles.MANAGER}],
=======
>>>>>>> origin/ui-schedules
            filterBuilderData: {},
            components: {},
            filter: false,
        };
    }

    //When changing name or role of the filter
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

    onSubmitFilters = (filters, components, filterBuilderData) => {
        const {close} = this.props;
        //Setting state and creating/editing report
        this.setState({
            components,
            filterBuilderData
        });

        const {generalInformation} = this.state;
        _.extend(generalInformation, {mongoFilters: EJSON.stringify(filters), filterBuilderData});

        Meteor.call('report.create', generalInformation, (err) => {
            if (!err) {
                Notifier.success('Report created');
                close();
            } else {
                Notifier.error(err.reason);
            }
        });
    };
<<<<<<< HEAD

    finish = () => {
        const filterBuilder = this.refs.filterBuilder;
        const filterForm = filterBuilder.refs.filters;
        filterForm.submit();
    };

    onCancel = () => {
        const {close} = this.props;
        close();
    };

    render() {
        const {hasGeneralInformation, components, filterBuilderData} = this.state;
        const allowedRoles = [{value: Roles.MANAGER, label: "Allow " + Roles.MANAGER + " role"}];

        return (
            <div className="create-form">
                {/*Upper bar*/}
                <div className="create-form__bar">
                    <button className="btn-add">+ Add report</button>
                    <div className="btn-group">
                        <button onClick={this.onCancel} className="btn-cancel">Cancel</button>
                        {
                            hasGeneralInformation &&
                            <button onClick={this.finish} className="btn--green">Confirm & save</button>
                        }
                    </div>
                </div>

=======

    finish = () => {
        const filterBuilder = this.refs.filterBuilder;
        const filterForm = filterBuilder.refs.filters;
        filterForm.submit();
    };

    onCancel = () => {
        const {close} = this.props;
        close();
    };

    render() {
        const {hasGeneralInformation, components, filterBuilderData} = this.state;
        const allowedRoles = [{value: Roles.MANAGER, label: "Allow " + Roles.MANAGER + " role"}];

        return (
            <div className="create-form">
                {/*Upper bar*/}
                <div className="create-form__bar">
                    <button className="btn-add">+ Add report</button>
                    <div className="btn-group">
                        <button onClick={this.onCancel} className="btn-cancel">Cancel</button>
                        {
                            hasGeneralInformation &&
                            <button onClick={this.finish} className="btn--green">Confirm & save</button>
                        }
                    </div>
                </div>

>>>>>>> origin/ui-schedules
                {/*Form with general data and filters*/}
                <div className="create-form__wrapper">
                    {/*General data*/}
                    <div className="action-block">
                        <div className="header__block">
                            <div className="title-block text-uppercase">general data</div>
                        </div>
                        <AutoForm onChange={this.onChange}
                                  ref="generalDataForm"
                                  schema={schema}>
                            <div className="form-wrapper">
                                <AutoField placeholder="Report name" name="name"/>
                                <ErrorField name="name"/>
                            </div>
<<<<<<< HEAD
                        }
                        {
                            //Filter Builder with widgets
                            filter &&
                            <TaskFilterBuilder
                                filterBuilderData={filterBuilderData}
                                components={components}
                                onSubmitFilters={this.onSubmitFilters.bind(this)}/>
                        }
                        {/*{*/}
                        {/*//Add filter button*/}
                        {/*hasGeneralInformation &&*/}
                        {/*<div className="add-filter text-center" onClick={this.addFilter}>+ Add filter</div>*/}
                        {/*}*/}
=======
>>>>>>> origin/ui-schedules

                            <div className="check-group">
                                <SelectField options={allowedRoles}
                                             name="allowedRoles"
                                             ref="allowedRoles"/>
                            </div>
                        </AutoForm>
                    </div>
                    {
                        hasGeneralInformation &&
                        //Filters section
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">Create fillters for report</div>
                            </div>
                        </div>
                    }
                    {
                        //Filter Builder with widgets
                        hasGeneralInformation &&
                        <TaskFilterBuilder
                            onSubmitFilters={this.onSubmitFilters.bind(this)}
                            filterBuilderData={filterBuilderData}
                            components={components}
                            ref="filterBuilder"/>
                    }
                </div>
            </div>
        );
    }
}

class FilterGroup extends Component {
    render() {
        const {close} = this.props;

        return (
            <div className="select-group">
                <div className="row-select">
                    <div className="type">Filter 1</div>
                    <div className="btn-delete" onClick={close}>Delete</div>
                </div>
                <div className="form-wrapper">
                    <select name="filter">
                        <option value="">Select filter</option>
                    </select>
                </div>
                <div className="form-wrapper">
                    <select name="filter">
                        <option value="">Name match</option>
                    </select>
                </div>
            </div>
        )
    }
}