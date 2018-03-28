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
            return <div>
                <AutoField placeholder="Select filter" name={name}/>
                <ErrorField name={name}/>
            </div>
        }
        if (ReportsService.isDate(name)) {
            return (
                <div>
                    <AutoField placeholder="Select minimum date" name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField placeholder="Select maximum date" labelHidden={true} name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isNumber(name)) {
            return (
                <div>
                    <AutoField placeholder="Type minimum value" name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField labelHidden={true} placeholder="Type maximum value" name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isLink(name)) {
            return (
                <div className="check-group">
                    <SelectField name={name} options={this.getOptions(name)}/>
                </div>
            )
        }

        return (
            <div>
                <AutoField placeholder="Type your filter" name={name}/>
                <ErrorField name={name}/>

                <AutoField labelHidden={true} placeholder="Select matching pattern" name={`${name}Match`}/>
                <ErrorField name={`${name}Match`}/>
            </div>
        )
    }

    render() {
        const {name} = this.props;
        return (
            <div>
                <div className="select-group">
                    <div className="row-select">
                        <div onClick={this.deleteFilter.bind(this, name)} className="btn-delete">Delete</div>
                    </div>
                    <div className="form-wrapper">
                        {
                            this.renderWidget(name)
                        }
                    </div>
                </div>
            </div>
        )
    }
}
