import React, {Component} from 'react';
import {AutoForm, AutoField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import Dropdown from '/imports/client/lib/Dropdown';
import classNames from 'classnames';
import Dialog from '/imports/client/lib/ui/Dialog';
import {SelectField} from '/imports/ui/forms';
import facilityQuery from "/imports/api/facilities/queries/facilityList";
import clientsQuery from "/imports/api/clients/queries/clientsWithFacilites";

export default class AccountSearchBar extends Component {
    constructor() {
        super();
        this.state = {
            active: false,
            filter: false,
            dropdown: false,
            selectAll: false,
            facilityOptions: [],
            clientOptions: []
        };
    }

    componentWillMount() {
        const facilityOptions = [];
        const clientOptions = [];

        facilityQuery.fetch((err, res) => {
            if (!err) {
                res.map((facility) => {
                    facilityOptions.push({label: facility.name, value: facility._id});
                });
                this.setState({facilityOptions});
            }
        });
        clientsQuery.fetch((err, res) => {
            if (!err) {
                res.map((client) => {
                    clientOptions.push({label: client.clientName, value: client._id});
                });
                this.setState({clientOptions});
            }
        });
    }

    manageFilterBar() {
        const {active, filter} = this.state;
        this.setState({
            active: !active,
            filter: !filter
        });
        this.props.decrease();
    }

    onHandleChange(field, value) {
        if (field === "state") {
            FlowRouter.setQueryParams({state: value});
        }
        if (field === "acctNum") {
            FlowRouter.setQueryParams({acctNum: value});
        } else if (field === "clientId") {
            FlowRouter.setQueryParams({clientId: value});
        } else if (field === "facilityId") {
            FlowRouter.setQueryParams({facilityId: value});
        }
    }

    openDropdown = () => {
        if (!this.state.dropdown) {
            document.addEventListener('click', this.outsideClick, false);
        } else {
            document.removeEventListener('click', this.outsideClick, false);
        }
        this.setState({
            dropdown: !this.state.dropdown
        });
    };

    outsideClick = (e) => {
        if (this.node.contains(e.target)) {
            return;
        }

        this.openDropdown();
    };

    nodeRef = (node) => {
        this.node = node;
    };

    selectAll = () => {
        const {selectAll} = this.state;
        this.setState({
            selectAll: !selectAll
        })
    };

    render() {
        const {filter, active, dropdown, selectAll, facilityOptions, clientOptions} = this.state;
        const {options, btnGroup, deleteAction, dropdownOptions, icons, getProperAccounts} = this.props;
        const stateOptions = [
            {label: "All", value: "all"},
            {label: "Current State", value: FlowRouter.current().params.state},
        ];

        const classes = classNames({
                'select-type': true,
                'open': dropdown
            }
        );
        const btnSelectClasses = classNames({
            'btn-select': true,
            'active': selectAll
        });

        return (
            <AutoForm ref="filters" onChange={this.onHandleChange.bind(this)} schema={schema}>
                <div className="search-bar">
                    <div className={classes} ref={this.nodeRef}>
                        <div className={btnSelectClasses} onClick={this.selectAll}/>
                        <div className="btn-toggle-dropdown" onClick={this.openDropdown}>
                            <i className="icon-angle-down"/>
                        </div>
                        {
                            dropdown &&
                            <Dropdown toggleDropdown={this.openDropdown} getProperAccounts={getProperAccounts}
                                      options={dropdownOptions}/>
                        }
                    </div>
                    <div className="search-bar__wrapper">
                        {btnGroup ? <BtnGroup getProperAccounts={getProperAccounts} icons={icons}
                                              deleteAction={deleteAction}/> : null}
                        <div className={btnGroup ? 'search-input' : 'search-input full__width'}>
                            <div className="form-group">
                                <AutoField labelHidden={true} name="acctNum" placeholder="Search by Account Number"/>
                            </div>
                        </div>

                        <div className={active ? 'filter-block active' : 'filter-block'}
                             onClick={this.manageFilterBar.bind(this)}>
                            <button><i className="icon-filter"/></button>
                        </div>
                    </div>
                </div>
                {
                    filter &&
                    <div className="filter-bar">
                        <div className="select-wrapper">
                            <div className="select-form">
                                <SelectField
                                    labelHidden={true}
                                    name="clientId"
                                    options={clientOptions}
                                />
                            </div>
                            <div className="select-form">
                                <SelectField
                                    labelHidden={true}
                                    name="facilityId"
                                    options={facilityOptions}
                                />
                            </div>
                            <div className="select-form" style={{marginTop: "1rem"}}>
                                <div className="form-group">
                                    <AutoField options={stateOptions} labelHidden={true} name="state"
                                               placeholder="State"/>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </AutoForm>
        );
    }
}

class BtnGroup extends Component {
    constructor() {
        super();
        this.state = {
            in: false,
            dialogIsActive: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({in: true});
        }, 1);
    }

    deleteAction = () => {
        this.setState({
            dialogIsActive: true
        });
    };

    closeDialog = () => {
        this.setState({
            dialogIsActive: false
        });
    };

    confirmDelete = () => {
        this.setState({
            dialogIsActive: false
        });
        this.props.deleteAction();
    };

    render() {
        const {deleteAction, icons} = this.props;
        const {dialogIsActive} = this.state;
        return (
            <div className={this.state.in ? 'btn-group in' : 'btn-group'}>
                {
                    icons
                        ?
                        icons.map((element) => {
                            return <button onClick={element.method}><i className={"icon-" + element.icon}/></button>
                        })
                        :
                        <button><i className="icon-archive"/></button>

                }
                {
                    deleteAction &&
                    <button onClick={this.deleteAction}><i className="icon-trash-o"/></button>
                }
                {
                    dialogIsActive && (
                        <Dialog className="account-dialog" closePortal={this.closeDialog}>
                            <div className="form-wrapper">
                                Are you sure you want to delete selected items ?
                            </div>
                            <div className="btn-group">
                                <button className="btn-cancel" onClick={this.closeDialog}>Cancel</button>
                                <button className="btn--light-blue" onClick={this.confirmDelete}>Confirm & delete
                                </button>
                            </div>
                        </Dialog>
                    )
                }
            </div>
        );
    }
}

const schema = new SimpleSchema({
    facilityId: {
        type: String,
        optional: true,
        label: "Filter by Facility"
    },
    clientId: {
        type: String,
        optional: true,
        label: "Filter by Client"
    },
    acctNum: {
        type: String,
        optional: true,
        label: "Search by Account Number"
    },
    state: {
        type: String,
        optional: true,
        label: "Choose global state or current one"
    }
});