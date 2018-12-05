import React from 'react';

export default class SortBar extends React.PureComponent {

    renderOptions(options) {
        return options.map((option, index) => {
            //TODO: Add class to the active arrow
            let ascClass = 'icon-angle-up ASC';
            let descClass = 'icon-angle-down DESC';
            
            // Check if this sort direction is activated
            // if(this.props.activeSort.label === option.label){
            //     if(this.props.activeSort.sortDirection === 'ASC') {
            //         ascClass = ascClass + ' active-asc';
            //         return;
            //     }

            //     descClass = descClass + ' active-desc';
            // }

            return(
                <div className='sort-options' key={index}>
                    <div>
                        {option.label}
                    </div>
                    <div className='sort-icons'>
                        <span
                            onClick={() => option.onChange('ASC', option.label)}
                            className={ascClass}
                        />
                        <span
                            onClick={() => option.onChange('DESC', option.label)}
                            className={descClass}
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