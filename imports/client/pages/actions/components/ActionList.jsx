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
                <ActionSingle
                    key={index}
                    id={index}
                    renderContent={this.props.renderContent}
                    showBtnGroup={this.props.showBtnGroup}
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
