import React, {Component} from 'react';
import Roles from "../../../api/users/enums/roles";
import schema from "/imports/api/reports/schema";
import {AutoForm, AutoField, ErrorField, SelectField} from "/imports/ui/forms";

export default class ReportCreate extends Component {
    constructor() {
        super();
        this.state = {
            filter: false,
            hasGeneralInformation: true,
            generalInformation: {},
            allowedRoles: [{value: Roles.MANAGER, label: Roles.MANAGER}],
        };
        this.addFilter = this.addFilter.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
    }

    addFilter() {
        this.setState({
            filter: true
        })
    }

    closeFilter() {
        this.setState({
            filter: false
        })
    }

    render() {
        const {filter, hasGeneralInformation, allowedRoles} = this.state;

        return (
            <div className="create-form">
                <form action="">
                    {/*Upper bar*/}
                    <div className="create-form__bar">
                        <button className="btn-add">+ Add report</button>
                        <div className="btn-group">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn--green">Confirm & save</button>
                        </div>
                    </div>

                    {/*Form with general data and filters*/}
                    <div className="create-form__wrapper">
                        {/*General data*/}
                        <div className="action-block">
                            <div className="header__block">
                                <div className="title-block text-uppercase">general data</div>
                            </div>
                            <AutoForm schema={schema}>
                                <div className="form-wrapper">
                                    <AutoField placeholder="Report name" name="name"/>
                                    <ErrorField name="name"/>
                                </div>

                                <SelectField name="allowedRoles"
                                             options={allowedRoles}/>

                                <div className="form-wrapper">
                                    <input type="text" placeholder="Report name"/>
                                </div>
                                <div className="check-group">
                                    <input type="checkbox" id="c1"/>
                                    <label htmlFor="c1">Allow manager role</label>
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
                                <div className="label-filter text-light-grey">Extracted filters ()</div>
                            </div>
                        }
                        {
                            //Widget for filters
                            filter && <FilterGroup close={this.closeFilter}/>
                        }
                        {
                            //Add filter button
                            hasGeneralInformation &&
                            <div className="add-filter text-center" onClick={this.addFilter}>+ Add filter</div>
                        }

                    </div>
                </form>
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