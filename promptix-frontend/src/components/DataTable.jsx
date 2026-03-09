import React from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, keyField, onRowClick, renderActions, selectable, selectedRows = [], onSelectionChange, onSelectAll }) => {
    return (
        <div className="table-wrapper card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            {selectable && (
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        className="checkbox-custom"
                                        checked={data.length > 0 && selectedRows.length === data.length}
                                        onChange={onSelectAll}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx}>{col.header}</th>
                            ))}
                            {renderActions && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (renderActions ? 1 : 0) + (selectable ? 1 : 0)} className="text-center">No data available</td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row[keyField]} onClick={() => onRowClick && onRowClick(row)} className={onRowClick ? 'clickable-row' : ''}>
                                    {selectable && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="checkbox-custom"
                                                checked={selectedRows.includes(row[keyField])}
                                                onChange={() => onSelectionChange(row[keyField])}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, idx) => (
                                        <td key={idx}>
                                            {col.render ? col.render(row) : row[col.field]}
                                        </td>
                                    ))}
                                    {renderActions && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            {renderActions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
