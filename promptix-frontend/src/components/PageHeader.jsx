import React from 'react';
import './PageHeader.css';

const PageHeader = ({ titlePrefix, title, subtitle, actionButtonLabel, onActionClick }) => {
    return (
        <div className="page-header-container">
            <div className="page-header-left">
                <div className="page-header-title-wrapper">
                    {titlePrefix}
                    <h1 className="page-header-title">{title}</h1>
                </div>
                {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
            </div>

            <div className="page-header-right">
                {actionButtonLabel && (
                    <button
                        className="btn-primary"
                        onClick={onActionClick}
                    >
                        {actionButtonLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
