import React from 'react';
import './TwoColumnLayout.css';

const TwoColumnLayout = ({ leftContent, rightContent }) => {
    return (
        <div className="two-column-layout">
            <div className="layout-left-col">
                {leftContent}
            </div>
            <div className="layout-right-col">
                {rightContent}
            </div>
        </div>
    );
};

export default TwoColumnLayout;
