import React, { Component } from 'react';
import SubStateHeader from './components/SubStateContent/SubStateHeader';
// import LetterBody from './components/SubStateContent/LetterBody';
// import DescriptionBlock from './components/SubStateContent/DescriptionBlock';
import SubStateEdit from './SubStateEdit.jsx'

export default class SubStateContent extends Component {
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
        const { subState } = this.props;
        const { edit } = this.state;
        return (
            <div>
                {edit ? <SubStateEdit model={subState} close={this.setEdit} /> :
                    <div className="main-content letter-temp-content">
                        <SubStateHeader onEdit={this.setEdit} subState={subState} />
                        {/* <DescriptionBlock subState={subState}/> */}
                        {/* <LetterBody subState={subState}/> */}
                    </div>
                }
            </div>

        )
    }
}