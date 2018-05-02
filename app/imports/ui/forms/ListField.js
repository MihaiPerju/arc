import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import joinName       from 'uniforms/joinName';
import {Children}     from 'react';

import ListAddField  from './ListAddField';
import ListItemField from './ListItemField';
import classNames from 'classnames';

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            // showBtnCollapse: this.props.value
        }
    }

    render() {
        const {
            children,
            initialCount,
            itemProps,
            label,
            name,
            value,
            collapse,
            showListField,
            ...props
        } = this.props;

        const listFieldClasses = classNames({
            'list-field__wrapper': true,
            'hidden': collapse
        })

        const {showBtnCollapse} = this.state;

        return (
            <div className="insurance-block" {...filterDOMProps(props)}>
                {label && (
                    <label className="add-insurance text-center">
                        <span>Add {label}</span>

                        <ListAddField name={`${name}.$`} initialCount={initialCount} showListField={showListField}/>
                    </label>
                )}

                <div className={listFieldClasses}>
                    {children ? (
                        value.map((item, index) =>
                            Children.map(children, child =>
                                React.cloneElement(child, {
                                    key: index,
                                    label: null,
                                    name: joinName(name, child.props.name && child.props.name.replace('$', index))
                                })
                            )
                        )
                    ) : (
                        value.map((item, index) =>
                            <ListItemField key={index} label={null} name={joinName(name, index)} {...itemProps} />
                        )
                    )}
                </div>

            </div>
        )
    }
}

export default connectField(List, {ensureValue: true, includeInChain: false});
