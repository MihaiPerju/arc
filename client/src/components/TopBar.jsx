import React from 'react';

export default class SearchInput extends React.PureComponent {
    
    render() {
        return (
            <div className='search-bar'>
                <div className='select-type'>
                </div>
                <div className="search-bar__wrapper flex--helper">
                    <div className='search-input full__width sort__width tag-btn'>
                        <div className="form-group">
                            <input 
                                maxLength={this.props.maxLength || null}
                                minLength={this.props.minLength || null}
                                pattern={this.props.pattern || null}
                                placeHolder={this.props.placeHolder || null}
                                readOnly={this.props.readOnly || false}
                                size={this.props.size || null}
                                spellCheck={this.props.spellCheck || false}
                                className={this.props.className || 'search-input'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}