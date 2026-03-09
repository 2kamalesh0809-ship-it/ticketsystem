import React from 'react';
import './forms.css';

const SelectInput = ({ label, value, onChange, options = [], required = false, disabled = false, className = '' }) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>}
            <select
                className="input-field"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
