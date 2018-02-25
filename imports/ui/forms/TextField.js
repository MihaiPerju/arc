import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

const Text = ({
                  disabled,
                  id,
                  inputRef,
                  label,
                  name,
                  onChange,
                  placeholder,
                  type,
                  value,
                  backgroundStyle,
                  ...props
              }) =>
    <div {...filterDOMProps(props)}>
        {label && (
            <label htmlFor={id}>
                {label}
            </label>
        )}
        {
            console.log(backgroundStyle)
        }
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
