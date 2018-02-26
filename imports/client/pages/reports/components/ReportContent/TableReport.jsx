import React, {Component} from 'react';
import classNames from 'classnames';

export default class TableReport extends Component {
    render() {        
        const { title, rows, fixed } = this.props;
        const classes = classNames({
            'table-container': true,
            'fixed-container': fixed
        });

        return (
            <div className={classes}>
                <div className="table-header text-light-grey">{title}</div>
                {
                    rows.map(function(row, index){
                        return (
                            <div key={index} className="table-row">{row.title}</div>
                        )
                    })
                }
            </div>
        )
    }
}