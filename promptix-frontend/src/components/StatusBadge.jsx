import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status) {
            case 'Open': return 'status-badge-open';
            case 'In Progress': return 'status-badge-in-progress';
            case 'Resolved': return 'status-badge-resolved';
            case 'Closed': return 'status-badge-closed';
            default: return 'status-badge-default';
        }
    };

    return (
        <span className={`status-badge ${getStatusClass()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
