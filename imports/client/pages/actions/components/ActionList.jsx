import React, {Component} from 'react';
import ActionSingle from './ActionSingle';

export default class ActionList extends Component {
    constructor() {
        super();
    }

    render() {                
        const actions = [
            { name: 'Action1' },
            { name: 'Action2' },
            { name: 'Action3' }
        ];
        const actionList = actions.map(function(action, index){
            return (
                const {renderContnent, showBtnGroup} = this.props;
                <ActionSingle
                    key={index}
                    id={index}
                    renderContent={renderContent}
                    showBtnGroup={showBtnGroup}
                    name={action.name}
                />
            )
        }, this)
        return (
            <div className={this.props.class}>
                { actionList }
            </div>
        );
    }
}
