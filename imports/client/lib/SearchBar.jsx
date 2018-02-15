import React, {Component} from 'react';
import {AutoForm, AutoField, ErrorField, SelectField} from '/imports/ui/forms';
import SimpleSchema from "simpl-schema";

export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            active: false
        };
        this.renderFilterBar = this.renderFilterBar.bind(this);
    }

    renderFilterBar() {
        this.setState({
            active: !this.state.active
        });
        this.props.filter();
    }

    render() {
        return (
            <div className="search-bar">
                <div className="select-type">
                    <div className="btn-select"></div>
                </div>
                {this.props.btnGroup ? <BtnGroup/> : null}
                <div className={this.props.btnGroup ? "search-input" : "search-input full__width"}>
                    <div className="form-group">
                        <AutoForm schema={schema}>
                            <SelectField name="facilityId" options={[{value: 2, label: 1}, {value: 3, label: 4}]}/>
                        </AutoForm>
                    </div>
                </div>

                {/*<form action="" className={this.props.btnGroup ? "search-input" : "search-input full__width"}>*/}
                    {/*<div className="form-group">*/}
                        {/*<input type="text" placeholder="&#xf002;  Search"/>*/}
                    {/*</div>*/}
                {/*</form>*/}
                <div className={this.state.active ? "filter-block active" : "filter-block"}
                     onClick={this.renderFilterBar}>
                    <button><i className="icon-filter"/></button>
                </div>
            </div>
        )
    }
}

class BtnGroup extends Component {
    constructor() {
        super();
        this.state = {
            in: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({in: true});
        }, 1);
    }

    render() {
        return (
            <div className={this.state.in ? "btn-group in" : "btn-group"}>
                <button><i className="icon-archive"/></button>
                <button><i className="icon-trash-o"/></button>
            </div>
        )
    }
}


const schema = new SimpleSchema({
    facilityId: {
        type: String,
        optional: true,
        label: 'Filter by facility'
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