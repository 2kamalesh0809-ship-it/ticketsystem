import React from 'react';
import './forms.css';

const DatePicker = ({ label, value, onChange, required = false, disabled = false, className = '' }) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>}
            <input
                type="date"
                className="input-field"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
        </div>
    );
};

export default DatePicker;
