import React, {Component} from 'react';

export default class CreateClient extends Component {

    render() {
        return (
            <div className="main-content client-content">
                <h1>CreateClient</h1>
                <button onClick={this.closeForm}>Cancel</button>
            </div>
        )
    }
}