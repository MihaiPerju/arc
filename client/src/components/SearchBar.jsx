import React from 'react';

/**
 * This is a controlled componenet, it takes in all normal HTML props and a onChange FN.
 * You can pass left and right side icons, which will be rendered on their perspective sides of the bar.
 * 
 * Example icons array: [classname='', method=fn]
 * 
 * TODO: The border radious on the box isn't right
 * 
 * @param {Number} maxLength The max number of chars for the input length
 * @param {Number} minLength The minimume number of chars for the input
 * @param {RegExp} pattern A regular expression to match input to
 * @param {String} placeHolder The placeholder text when there is no input
 * @param {Boolean} readOnly Wether or not field can be edited by user
 * @param {Number} size How many chars wide the field should be. (Do not normally use, we are doing max width 100%)
 * @param {Boolean} spellCheck Should spell check be on or not, default is off.
 * @param {String} className Class names to be added, default is search-input
 * @param {String} value The current / controlled value of this componenet
 * @param {Function} onChange The function to call when input is changed
 * @param {Array} leftIcons The icons to render to the left of the bar
 * @param {Array} rightIcons This ocons to render to the right of the bar
 */
export default class SearchInput extends React.PureComponent {
    renderIcons(icons) {
        return (
            <div className='filter-block flex--helper'>
                {
                    icons.map((element, index) => {
                        return (
                            <button onClick={element.method} key={index}>
                                <i className={element.className} />
                            </button>
                        );
                    })
                }
            </div>
        )
    }
    
    render() {
        return (
            <div className='search-bar'>
                <div className='select-type'>
                </div>
                <div className="search-bar__wrapper flex--helper">
                    {this.props.leftIcons ? this.renderIcons(this.props.leftIcons) : null}
                    <div className='search-input full__width sort__width tag-btn'>
                        <div className="form-group">
                            <input 
                                maxLength={this.props.maxLength || null}
                                minLength={this.props.minLength || null}
                                pattern={this.props.pattern || null}
                                placeholder={this.props.placeHolder || null}
                                readOnly={this.props.readOnly || false}
                                size={this.props.size || null}
                                spellCheck={this.props.spellCheck || false}
                                className={this.props.className || 'search-input'}
                                value={this.props.currentValue || ''}
                                onChange={this.props.onChange || null}
                            />
                        </div>
                    </div>
                    {this.props.rightIcons ? this.renderIcons(this.props.rightIcons) : null}
                </div>
            </div>
        )
    }
}