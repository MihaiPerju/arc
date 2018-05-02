import React, {Component} from 'react';
import classNames from 'classnames';

export default class TableReport extends Component {
    render() {
        const { title, rows, center } = this.props;
        const classes = classNames({
            'table-container': true,
            'text-center': center
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