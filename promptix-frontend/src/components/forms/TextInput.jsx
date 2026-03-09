import React from 'react';
import './forms.css';

const TextInput = ({ label, type = 'text', name, value, onChange, placeholder, required = false, disabled = false, className = '' }) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>}
            <input
                type={type}
                name={name}
                className="input-field"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </div>
    );
};

export default TextInput;
