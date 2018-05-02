import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const ListAdd = ({
    disabled,
    parent,
    value,
    showListField,
    ...props
}) => {
    const limitNotReached = !disabled && !(parent.maxCount <= value.length);
    const handleClick = () => {
        limitNotReached && parent.onChange(parent.value.concat([value]));
        showListField();
    }

    return (
        <span
            className="insurance-action add"
            {...filterDOMProps(props)}
            onClick={handleClick}
        >
            +
        </span>
    );
};

export default connectField(ListAdd, {includeParent: true, initialValue: false});
