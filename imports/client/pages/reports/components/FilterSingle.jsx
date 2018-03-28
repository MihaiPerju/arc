import React from 'react';
import ReportsService from '../../../../api/reports/services/ReportsService';
import {AutoField, ErrorField, SelectField} from '/imports/ui/forms';

export default class FiltersSingle extends React.Component {
    constructor() {
        super();
    }

    deleteFilter = (name) => {
        this.props.deleteFilter(name);
    };

    getOptions() {
        const {name, assigneeIdOptions, facilityIdOptions} = this.props;
        return name === 'assigneeId' ? assigneeIdOptions : facilityIdOptions;
    }

    renderWidget(name) {
        if (ReportsService.isEnum(name)) {
            return <div className="select-wrapper m-t--0">
                <AutoField placeholder="Select filter" labelHidden={true} name={name}/>
                <ErrorField name={name}/>
            </div>
        }
        if (ReportsService.isDate(name)) {
            return (
                <div className="input-datetime">
                    <AutoField placeholder="Select minimum date" labelHidden={true} name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField placeholder="Select maximum date" labelHidden={true} name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isNumber(name)) {
            return (
                <div className="form-wrapper__i">
                    <AutoField labelHidden={true} placeholder="Type minimum value" name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField labelHidden={true} placeholder="Type maximum value" name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isLink(name)) {
            return (
                <div className="check-group">
                    <SelectField labelHidden={true} name={name} options={this.getOptions(name)}/>
                </div>
            )
        }

        return (
            <div>
                <div className="form-wrapper__i">
                    <AutoField labelHidden={true} placeholder="Type your filter" name={name}/>
                    <ErrorField name={name}/>
                </div>
                <div className="select-wrapper">
                    <AutoField labelHidden={true} placeholder="Select matching pattern" name={`${name}Match`}/>
                    <ErrorField name={`${name}Match`}/>
                </div>
            </div>
        )
    }

    render() {
        const {name} = this.props;
        return (
            <div>
                <div className="filter-type__wrapper">
                    <div className="row-select">
                        <div className="type text-light-grey">{name}</div>
                        <div onClick={this.deleteFilter.bind(this, name)} className="btn-delete">Delete</div>
                    </div>
                    {
                        this.renderWidget(name)
                    }
                </div>
            </div>
        )
    }
}
