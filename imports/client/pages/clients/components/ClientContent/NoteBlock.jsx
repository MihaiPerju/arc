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
			        <div className="title-block text-uppercase">Note</div>
			    </div>
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