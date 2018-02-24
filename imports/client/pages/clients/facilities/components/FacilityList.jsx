import React, {Component} from 'react';
import FacilitySingle from './FacilitySingle';

export default class Facility extends Component {
    render() {
        const imgPath = '/assets/img/';
        const facilities = [
            { name: 'Facility1', avatar: imgPath + 'user.svg' },
            { name: 'Facility2', avatar: imgPath + 'user1.svg' },
            { name: 'Facility3', avatar: imgPath + 'user2.svg' }
        ];
        const { renderContent, showBtnGroup } = this.props;

        return (
            <div className={this.props.class}>
                {
                    facilities.map(function(facility, index){
                        return (
                            <FacilitySingle
                                key={index}
                                id={index}
                                name={facility.name}
                                avatar={facility.avatar}
                                renderContent={renderContent}
                                showBtnGroup={showBtnGroup}
                            />
                        )
                    })
                }
            </div>
        )
    }
}