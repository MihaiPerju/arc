import React, {Component} from 'react';
import RegionEdit from '/imports/client/pages/regions/RegionEdit.jsx';
export default class RegionContent extends Component {
    constructor() {
        super();
        this.state = {
            edit: false
        }
    }
    setEdit = () => {
        const {edit} = this.state;
        this.setState({edit: !edit})
    };

    render() {
        const {region} = this.props;
        const {edit} = this.state;
        return (
            <div>
                {
                    edit ? <RegionEdit region={region} close={this.setEdit}/> :
                        <div className="main-content flex-content region-content">
                            <div className="main-content flex-content region-content">
                                <div className="intro-block text-center">
                                    <i className="icon-globe"/>
                                    <div className="text-light-grey">Region name</div>
                                    <div className="region">{region.name}</div>
                                </div>
                                <div className="text-center">
                                    <button type="button" onClick={this.setEdit} className="btn-edit btn--white">
                                        Edit region
                                    </button>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}