import React, {Component} from 'react';

export default class NoteItem extends Component {
	render() {
		const { avatar, name } = this.props;
		
		return (
			<div className="note-item">
			    <div className="note-info">
			        <img className="md-avatar img-circle" src={avatar} alt=""/>
			        <div className="info">
			            <div className="name">{name}</div>
			            <div className="text text-light-grey">Everything looks ready for work, dont forget that!</div>
			        </div>
			    </div>
			    <div className="note-time">11:20</div>
			</div>
		)
	}
}