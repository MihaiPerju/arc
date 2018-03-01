import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const Text = ({
                  disabled,
                  id,
                  inputRef,
                  label,
                  labelHidden,
                  name,
                  onChange,
                  placeholder,
                  type,
                  value,
                  backgroundStyle,
                  ...props
              }) =>
    <div {...filterDOMProps(props)}>
        {label && !labelHidden && (
            <label htmlFor={id}>
                {label}
            </label>
        )}
        <input
            style={backgroundStyle}
            disabled={disabled}
            id={id}
            name={name}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder}
            ref={inputRef}
            type={type}
            value={value}
        />
    </div>
;

Text.defaultProps = {type: 'text'};

export default connectField(Text);
