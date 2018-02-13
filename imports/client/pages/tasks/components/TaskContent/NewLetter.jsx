import React, {Component} from 'react';
import SelectBlock from '/imports/client/lib/SelectBlock.jsx';

export default class NewLetter extends Component {
    constructor() {
        super();
        this.state = {
            fade: false
        }
    }
    
    componentDidMount() {
        setTimeout(() => {
            this.setState({fade: true});
        }, 1);
    }

    render() {
        return (
            <div className={this.state.fade ? "new-letter in" : "new-letter"}>
                <div className="row-block">
                    <div className="info">
                        <img className="md-avatar img-circle" src="/assets/img/user1.svg" alt=""/>
                        <div className="name">Solomon Ben</div>
                    </div>
                    <div className="form-group">
                        <SelectBlock header={'Select letter'}/>
                        <button className="btn--red">Cancel</button>
                    </div>
                </div>
                <form action="" className="letter-template">
                    <div className="left-col">
                        <div className="form-group">
                            <input type="text" placeholder="Company name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Company addr block"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Letter date"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Addr block"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="First name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Second name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Signature"/>
                        </div>
                        <div className="form-group">
                            <input type="text" placeholder="Title"/>
                        </div>
                    </div>
                    <div className="right-col">
                        <p>Dear Mr. John,</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id porro eum, ducimus. 
                        Neque saepe dolorem perferendis eos nihil. Accusamus atque, dolore qui praesentium doloribus reiciendis laudantium, 
                        quibusdam beatae! Dolore, magnam.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                        <p>Sincerily</p>
                        <button className="btn--green btn-save">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}