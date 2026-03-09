import React from 'react';
import './forms.css';

const FormButton = ({ children, type = 'submit', variant = 'primary', onClick, disabled = false, className = '' }) => {
    const btnClass = variant === 'primary' ? 'btn-primary' : (variant === 'secondary' ? 'btn-secondary' : 'btn-outline');

    return (
        <button
            type={type}
            className={`form-btn ${btnClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default FormButton;
