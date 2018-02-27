import React from 'react';
import {Segment, Button, Divider} from 'semantic-ui-react'
import ReportsService from '../../../../api/reports/services/ReportsService';
import {AutoForm, AutoField, ErrorField, SelectField} from '/imports/ui/forms';
import TaskReportFields from '../../../../api/tasks/config/tasks';

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

    renderWidget(name, TaskReportFields) {
        if (ReportsService.isEnum(name, TaskReportFields)) {
            return <div>
                <AutoField placeholder="Select filter" noLabel={true} name={name}/>
                <ErrorField name={name}/>
            </div>
        }
        if (ReportsService.isDate(name, TaskReportFields)) {
            return (
                <div>
                    <AutoField name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isNumber(name, TaskReportFields)) {
            return (
                <div>
                    <AutoField noLabel={true} placeholder="Type minimum value" name={`${name}Start`}/>
                    <ErrorField name={`${name}Start`}/>

                    <AutoField noLabel={true} placeholder="Type maximum value" name={`${name}End`}/>
                    <ErrorField name={`${name}End`}/>
                </div>
            )
        }

        if (ReportsService.isLink(name, TaskReportFields)) {
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

                <AutoField placeholder="Select matching pattern" name={`${name}Match`}/>
                <ErrorField name={`${name}Match`}/>
            </div>
        )
    }

    render() {
        const {name} = this.props;
        return (
            <div>
                {/*<Button onClick={this.deleteFilter.bind(this, name)}*/}
                {/*attached='top'*/}
                {/*color="red">*/}
                {/*Delete*/}
                {/*</Button>*/}
                <div className="select-group">
                    <div className="row-select">
                        <div className="type">{name}</div>
                        <div className="btn-delete">Delete</div>
                    </div>
                    <div className="form-wrapper">
                        {
                            this.renderWidget(name, TaskReportFields)
                        }
                    </div>
                </div>
            </div>
        )
    }
}
