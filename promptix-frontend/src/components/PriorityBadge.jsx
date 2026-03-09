import React from 'react';
import './PriorityBadge.css';

const PriorityBadge = ({ priority }) => {
    const getPriorityClass = () => {
        switch (priority) {
            case 'Critical': return 'priority-badge-critical';
            case 'High': return 'priority-badge-high';
            case 'Medium': return 'priority-badge-medium';
            case 'Low': return 'priority-badge-low';
            default: return 'priority-badge-default';
        }
    };

    return (
        <span className={`priority-badge ${getPriorityClass()}`}>
            {priority}
        </span>
    );
};

export default PriorityBadge;
