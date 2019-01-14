import React from "react";
import ReportsService from "../../../../api/reports/services/ReportsService";
import { AutoField, ErrorField, SelectField, BoolField } from "/imports/ui/forms";
import DateField from "/imports/client/lib/uniforms/DateField";
import SelectMulti from "/imports/client/lib/uniforms/SelectMulti.jsx";
import { stateOptions } from "/imports/api/accounts/enums/states";


export default class FiltersSingle extends React.Component {
  constructor() {
    super();
    this.state = {
      dateSpanOptions: [],
      disableDateField: false,
      dateSpanValue: ''
    };
  }

  componentWillMount() {
    this.prepareDateSpanOptions();
  }

  componentDidMount() {
    this.bindValues();
  }

  bindValues() {
    const { name, filterData } = this.props;
    if (ReportsService.isDate(name)) {
      let isCheckedRelativeDateSpan = filterData[`${name}Chkbox`];
      this.setState({ disableDateField: isCheckedRelativeDateSpan });
    }
  }

  prepareDateSpanOptions() {
    let dateSpanOptions = this.state.dateSpanOptions;
    dateSpanOptions.push({ value: 'today', label: 'Today' });
    dateSpanOptions.push({ value: 'yesterday', label: 'Yesterday' });
    dateSpanOptions.push({ value: 'week_to_date', label: 'Week To Date' });
    dateSpanOptions.push({ value: 'last_week', label: 'Last Week' });
    dateSpanOptions.push({ value: 'month_to_date', label: 'Month To Date' });
    dateSpanOptions.push({ value: 'last_month', label: 'Last Month' });
    dateSpanOptions.push({ value: 'year_to_date', label: 'Year To Date' });
    dateSpanOptions.push({ value: 'last_year', label: 'Last Year' });
    this.setState({ dateSpanOptions });
  }

  deleteFilter = name => {
    this.props.deleteFilter(name);
  };

  getOptions(name) {
    const {
      clientIdOptions,
      assigneeIdOptions,
      facilityIdOptions
    } = this.props;
    switch (name) {
      case "assigneeId":
        return assigneeIdOptions;
      case "facilityId":
        return facilityIdOptions;
      default:
        return clientIdOptions;
    }
  }

  changeState = (isChecked) => {
    this.setState({
      disableDateField: isChecked
    });
   
  }

  onChange = (val) => {
    this.setState({ dateSpanValue: val });
  }

  renderWidget(name) {
    const { substateOptions } = this.props;
    if (ReportsService.isEnum(name)) {
      return (
        <div className="select-wrapper m-t--0">
          <SelectMulti
            
            placeholder="Select filter"
            name={name}
            options={name === "state" ? stateOptions : substateOptions}
          />
          <ErrorField name={name} />
        </div>
      );
    }
    if (ReportsService.isDate(name)) {
      return (
        <div>
          <div className="float-left">
            <div className="input-datetime">
              <DateField
                placeholder="Select start date"
                
                name={`${name}Start`}
                disabled={this.state.disableDateField}
              />
              <ErrorField name={`${name}Start`} />

              <DateField
                placeholder="Select finish date"
                
                name={`${name}End`}
                disabled={this.state.disableDateField}
              />
              <ErrorField name={`${name}End`} />
            </div>
          </div>
          <div className="float-right" style={{ paddingLeft: '20px' }}>
            <div className="select-wrapper border-style m-t--0">
              <SelectField
                
                name={`${name}DateSpan`}
                placeholder="Select Date Span"
                options={this.state.dateSpanOptions}
                disabled={!this.state.disableDateField}
              />
              <ErrorField name={`${name}DateSpan`} />
            </div>
          </div>
        </div>

      );
    }

    if (ReportsService.isNumber(name)) {
      return (
        <div className="form-wrapper__i">
          <AutoField
            
            placeholder="Type minimum value"
            name={`${name}Start`}
          />
          <ErrorField name={`${name}Start`} />

          <AutoField
            
            placeholder="Type maximum value"
            name={`${name}End`}
          />
          <ErrorField name={`${name}End`} />
        </div>
      );
    }

    if (ReportsService.isLink(name)) {
      return (
        <div className="check-group">
          <SelectField
            
            name={name}
            options={this.getOptions(name)}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="form-wrapper__i">
          <AutoField
            
            placeholder="Type your filter"
            name={name}
          />
          <ErrorField name={name} />
        </div>
        <div className="select-wrapper">
          <AutoField
            
            placeholder="Select matching pattern"
            name={`${name}Match`}
          />
          <ErrorField name={`${name}Match`} />
        </div>
      </div>
    );
  }

  render() {
    const { name } = this.props;

    return (
      <div className="filter-type__wrapper p-l--10">
        {
          ReportsService.isDate(name) ?
            <div className="m-t--10">
              <BoolField
                key={`${name}Chkbox`}
                name={`${name}Chkbox`}
                label={'Enable Relative Date Span'}
                onValueChange={this.changeState}
             />
            </div> : null
        }
        <div className="row-select p-l--0">
          <div className="type text-light-grey">{name}</div>
          <div
            onClick={this.deleteFilter.bind(this, name)}
            className="btn-delete"
          >
            Delete
          </div>
        </div>
        <div className="main-container">
          <div className="float-left">
            {this.renderWidget(name)}
          </div>
        </div>
      </div>
    );
  }
}
