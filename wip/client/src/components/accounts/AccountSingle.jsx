import React from "react";
import moment from "moment/moment";
import commaNumber from "comma-number";
export default class AccountSingle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontNormal: false,
            checked: false
        };
    }
    
    render() {
        //TODO: These props should prob be compressed down
        const { account, active, currentAccount, expiredTickle, tags } = this.props;
        
        const classes = classNames("list-item task-item", {
            "bg--yellow": active,
            "tickled-item": expiredTickle == 1,
            open: account._id === currentAccount
        });
        
        return (
            <div className={classes} onClick={this.onSelectAccount}>
                <div className="check-item">
                    <input type="checkbox" checked={active} className="hidden" />
                    <label onClick={this.onCheck.bind(this)} />
                </div>
                
                <div onClick={this.onFreeze} className="mark-task">
                    <input type="checkbox" className="hidden" />
                    <label />
                </div>
                <div className="row__item margin-top-10 ">
                    <div className="left__side">
                        <div className={this.state.fontNormal ? "person font-normal" : "person"}>
                            {account.ptName}
                        </div>
                    </div>
                    <div className="right__side">
                        <div className="patient-id text-dark-grey">{account.acctNum}</div>
                        <div className="substate">{account.substate}</div>
                        <div className="time">
                            {account && moment(account.createdAt).format(" hh:mm")}
                        </div>
                    </div>
                </div>
                
                <div className="row__item margin-top-10 ">
                    <div className="price">{commaNumber(account.acctBal)}</div>
                    <div className="location">
                    {account.facility && account.facility.name}
                    </div>
                </div>
                <div className="row__item margin-top-10">
                </div>
            </div>
        );
    }
}
