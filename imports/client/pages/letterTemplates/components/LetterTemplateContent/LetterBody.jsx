import React, {Component} from 'react';

export default class LetterBody extends Component {
    render() {
        return (
            <div className="action-block letter-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">letter body</div>
                </div>
                <div className="main__block">
                    <p>Dear Mr John Anyway</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet rerum accusamus, 
                    doloremque velit. Minima, delectus quam nemo illo alias fugit ex iure pariatur sit, 
                    atque, necessitatibus mollitia. Animi, suscipit, maxime.</p>
                    <p>Sincerly</p>
                </div>
            </div>
        )
    }
}