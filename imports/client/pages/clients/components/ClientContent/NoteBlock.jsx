import React, {Component} from 'react';
import NoteItem from './NoteItem';

export default class NoteBlock extends Component {
	render() {
		const imgPath = '/assets/img/';
        const notes = [
            { name: 'Beneon Dream', avatar: imgPath + 'user1.svg' },
            { name: 'Anton Anton', avatar: imgPath + 'user2.svg' }
        ];

		return(
			<div className="action-block">
			    <div className="header__block">
			        <div className="title-block text-uppercase">Notes</div>
			    </div>
			    <form action="" className="comment-block">
                    <div className="form-group">
                        <img className="md-avatar img-circle" src="/assets/img/user.svg" alt=""/>                          
                        <div contentEditable="true" className="text-area" placeholder="Leave you note"></div>
                        <button className="btn-post">Post</button>
                    </div>
                </form>
			    <div className="note-list">
			        {
			            notes.map(function(note, index){
			                return (
			                    <NoteItem
			                        key={index}
			                        name={note.name}
			                        avatar={note.avatar}
			                    />
			                )
			            })
			        }
			    </div>
			</div>
		)
	}
}