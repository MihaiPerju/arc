import React, {Component} from 'react';
import ClientSingle from './ClientSingle';

export default class ClientList extends Component {
    render() {
        return (
            <div className={this.props.class}>
                <ClientSingle renderContent={this.props.renderContent} showBtnGroup={this.props.showBtnGroup}/>
            </div>
        );
    }
}
