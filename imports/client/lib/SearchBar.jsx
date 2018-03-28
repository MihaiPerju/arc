import React, {Component} from 'react';
import {AutoForm, AutoField} from '/imports/ui/forms';
import SimpleSchema from 'simpl-schema';
import FilterBar from '/imports/client/lib/FilterBar.jsx';
import Dropdown from './Dropdown';
import classNames from 'classnames';
import Dialog from '/imports/client/lib/ui/Dialog';

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            active: false,
            filter: false,
            dropdown: false,
            selectAll: false
        };
    }

    manageFilterBar() {
        const {active, filter} = this.state;
        this.setState({
            active: !active,
            filter: !filter
        });
        this.props.decrease();
    }

    onHandleChange() {
        const {changeFilters} = this.props;
        const newFilters = this.refs.filters.state.modelSync;

        if (!newFilters.facilityId) {
            delete newFilters.facilityId;
        }
        if (!newFilters.assigneeId) {
            delete newFilters.assigneeId;
        }
        if (!newFilters.clientName && newFilters.clientName !== '') {
            delete newFilters.clientName;
            changeFilters(newFilters);
        } else {
            Meteor.call('client.getByName', newFilters.clientName, (err, clients) => {
                if (!err) {
                    let acctNums = [];
                    for (let client of clients) {
                        acctNums.push(client._id);
                    }
                    newFilters.acctNum = {$in: acctNums};
                    delete newFilters.clientName;
                    changeFilters(newFilters);
                }
            });
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
        const {filter, active, dropdown, selectAll} = this.state;
        const {options, btnGroup, deleteAction} = this.props;
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
                            dropdown && <Dropdown/>
                        }
                    </div>
                    <div className="search-bar__wrapper">
                        {btnGroup ? <BtnGroup deleteAction={deleteAction}/> : null}
                        <div className={btnGroup ? 'search-input' : 'search-input full__width'}>
                            <div className="form-group">
                                <AutoField labelHidden={true} name="clientName" placeholder="Search"/>
                            </div>
                        </div>

                        <div className={active ? 'filter-block active' : 'filter-block'}
                             onClick={this.manageFilterBar.bind(this)}>
                            <button><i className="icon-filter"/></button>
                        </div>
                    </div>
                </div>
                {
                    filter && <FilterBar options={options}/>
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
        const {deleteAction} = this.props;
        const {dialogIsActive} = this.state;
        return (
            <div className={this.state.in ? 'btn-group in' : 'btn-group'}>
                <button><i className="icon-archive"/></button>
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
        optional: true
    },
    assigneeId: {
        type: String,
        optional: true,
        label: 'Filter by assignee'
    },
    clientName: {
        type: String,
        optional: true,
        label: 'Search by patient name'
    }
});