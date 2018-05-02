import React          from 'react';
import connectField   from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const ListDel = ({
    disabled,
    name,
    parent,
    ...props
}) => {
    const fieldIndex      = +name.slice(1 + name.lastIndexOf('.'));
    const limitNotReached = !disabled && !(parent.minCount >= parent.value.length);

    return (
        <div className="remove-insurance">
            <span>Remove</span>
            <span
                className="insurance-action delete"
                {...filterDOMProps(props)}
                onClick={() => limitNotReached && parent.onChange([]
                    .concat(parent.value.slice(0,  fieldIndex))
                    .concat(parent.value.slice(1 + fieldIndex))
                )}
            >
                -
            </span>
        </div>

    );
};

export default connectField(ListDel, {includeParent: true, initialValue: false});
