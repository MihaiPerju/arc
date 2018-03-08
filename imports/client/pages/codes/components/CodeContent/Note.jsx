import React, {Component} from 'react';

export default class Note extends Component {
    render() {
        const imgPath = '/assets/img/';
        const notes = [
            { name: 'Beneon Dream', avatar: imgPath + 'user1.svg' },
            { name: 'Anton Anton', avatar: imgPath + 'user2.svg' }
        ];

        return (
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

class NoteItem extends Component {
    render() {
        const { name, avatar } = this.props;

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