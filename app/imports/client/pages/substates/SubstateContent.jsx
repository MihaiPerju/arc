import React, { Component } from 'react';
import SubstateHeader from './components/SubstateContent/SubstateHeader';
import SubstateEdit from './SubstateEdit.jsx'

export default class SubstateContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }

    componentWillReceiveProps() {
        this.setState({ edit: false });
    }

    setEdit = () => {
        const { edit } = this.state;
        this.setState({ edit: !edit })
    };

    render() {
        const { substate } = this.props;
        const { edit } = this.state;
        return (
            <div>
                {edit ? <SubstateEdit model={substate} close={this.setEdit} /> :
                    <div className="main-content letter-temp-content">
                        <SubstateHeader onEdit={this.setEdit} substate={substate} />
                    </div>
                }
            </div>

        )
    }
}