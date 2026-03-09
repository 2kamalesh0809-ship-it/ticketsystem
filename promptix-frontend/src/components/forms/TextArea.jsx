import React from 'react';
import './forms.css';

const TextArea = ({ label, value, onChange, placeholder, rows = 4, required = false, disabled = false, className = '' }) => {
    return (
        <div className={`form-group ${className}`}>
            {label && <label className="form-label">{label} {required && <span className="text-danger">*</span>}</label>}
            <textarea
                className="input-field note-textarea"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                disabled={disabled}
            />
        </div>
    );
};

export default TextArea;
