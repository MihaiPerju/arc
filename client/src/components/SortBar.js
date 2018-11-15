import React from 'react';

export default class SortBar extends React.PureComponent {

    renderOptions(options) {
        return options.map(option => {
            //TODO: Add class to the active arrow

            return(
                <div className='sort-options'>
                    <div>
                        {options.label}
                    </div>
                    <div className='sort-icons'>
                        <span
                            onClick={option.onASC}
                            className='icon-angle-up ASC'
                        />
                        <span
                            onClick={option.onDESC}
                            className='icon-angle-down DESC'
                        />
                    </div>
                </div>
            )
        })
    }

    render(){
        return(
            <div className='sort-bar'>
                    {this.renderOptions(this.props.options)}
            </div>
        )
    }
}