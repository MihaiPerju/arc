import React from "react";
import connectField from "uniforms/connectField";
import DatePicker from "react-datepicker";
import moment from "moment";

class TimePicker extends React.Component {
  constructor() {
    super();
    this.state = {
      date: null
    };
  }

  onChange = date => {
    if (date) {
      this.setState({ date });
      this.props.onChange(date.toDate());
    }
  };

  componentDidMount() {
    if (this.props && this.props.value) {
      this.setState({ date: moment(this.props.value) });
    }
  }

  render() {
    const { date } = this.state;
    return (
      <DatePicker
        selected={date}
        onChange={this.onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        dateFormat="LT"
        timeCaption="Time"
        placeholderText="Letter Compile Time"
      />
    );
  }
}

export default connectField(TimePicker, {
  ensureValue: false,
  includeInChain: false
});
