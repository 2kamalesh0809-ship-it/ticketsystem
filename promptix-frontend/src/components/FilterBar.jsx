import React from 'react';
import './FilterBar.css';
import { Search } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, searchPlaceholder, onSearchChange, actionButton }) => {
    return (
        <div className="filter-bar">
            {/* Left side: Search input */}
            <div className="filter-left">
                {onSearchChange && (
                    <div className="search-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            className="input-field search-input"
                            placeholder={searchPlaceholder || "Search..."}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Right side: Dropdown Filters and actions */}
            <div className="filter-right">
                {filters && filters.map((filter, index) => (
                    <select
                        key={index}
                        className="input-field filter-select"
                        onChange={(e) => onFilterChange(filter.key, e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>{filter.placeholder}</option>
                        <option value="ALL">All</option>
                        {filter.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ))}
                {actionButton && <div className="filter-actions">{actionButton}</div>}
            </div>
        </div>
    );
};

export default FilterBar;
