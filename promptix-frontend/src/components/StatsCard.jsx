import React, { useState, useEffect } from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // If the value is not a simple number (e.g., "33.3%" or "4h 12m"), 
        // don't animate it to avoid NaN results.
        const isSimpleNumber = !isNaN(value) && !isNaN(parseFloat(value));

        if (!isSimpleNumber) {
            setDisplayValue(value);
            return;
        }

        let startTimestamp = null;
        const duration = 1000;
        const startValue = Number(displayValue) || 0;
        const endValue = Number(value);

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = progress * (2 - progress);

            // If it's a float, keep one decimal place, else use floor
            const current = endValue % 1 === 0
                ? Math.floor(easedProgress * (endValue - startValue) + startValue)
                : (easedProgress * (endValue - startValue) + startValue).toFixed(1);

            setDisplayValue(current);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    return (
        <div className="card stats-card">
            <div className="stats-card-main">
                <div className="stats-info">
                    <h3 className="stats-title">{title}</h3>
                    <p className="stats-value">{displayValue}</p>
                </div>
                {Icon && (
                    <div className="stats-icon-wrapper">
                        <Icon size={24} />
                    </div>
                )}
            </div>

            {trend !== undefined && (
                <div className="stats-trend">
                    <span className={`trend-value ${trend >= 0 ? 'trend-positive' : 'trend-negative'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="trend-label">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
