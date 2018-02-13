import React, {Component} from 'react';
import SelectBlock from '/imports/client/lib/SelectBlock.jsx';

export default class NewAction extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }
    
    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    render() {
        return (
            <div className={this.state.fade ? "new-action in" : "new-action"}>
                <div className="action-info">
                    <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                    <div className="name">Solomon Ben</div>
                </div>
                <form action="" className="action-form">
                    <SelectBlock header={'Select action'}/>
                    <div className="form-group">
                        <input type="text" placeholder="Note"/>
                    </div>
                    <div className="btn-group">
                        <button className="btn--red">Cancel</button>
                        <button className="btn--green">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}