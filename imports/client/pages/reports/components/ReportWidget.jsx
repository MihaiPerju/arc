import {Component} from "react";

class ReportWidget extends Component {
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