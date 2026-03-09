import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useTickets } from '../context/TicketContext';
import { Plus, Eye, UserPlus, Check, XCircle, Search, Filter } from 'lucide-react';
import './Tickets.css';

const Tickets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { tickets, updateTicket, bulkUpdateTickets } = useTickets();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [bulkAgent, setBulkAgent] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const isManager = user?.role === 'Manager';

    // Memoized, Sorted, and Filtered Data
    const processedTickets = useMemo(() => {
        let filtered = [...tickets];

        // Search logic
        if (searchTerm) {
            const lowTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(t =>
                t.id.toLowerCase().includes(lowTerm) ||
                t.customerName.toLowerCase().includes(lowTerm) ||
                (t.phone && t.phone.toLowerCase().includes(lowTerm))
            );
        }

        // Custom Filter Logic
        if (statusFilter !== 'ALL') {
            if (statusFilter === 'High Priority') {
                filtered = filtered.filter(t => t.priority === 'High' || t.priority === 'Critical');
            } else if (statusFilter === 'Open') {
                filtered = filtered.filter(t => t.status === 'Open');
            } else if (statusFilter === 'Closed') {
                filtered = filtered.filter(t => t.status === 'Closed' || t.status === 'Resolved');
            }
        }

        // Default Sort: Newest First
        return filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.createdDate);
            const dateB = new Date(b.createdAt || b.createdDate);
            return dateB - dateA;
        });
    }, [tickets, searchTerm, statusFilter]);

    // Handle filter preset clicks
    const filters = [
        { label: 'All Tickets', value: 'ALL' },
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' },
        { label: 'High Priority', value: 'High Priority' }
    ];

    const handleQuickClose = (id) => {
        updateTicket(id, { status: 'Closed' });
        setSuccessMessage(`Ticket ${id} marked as closed`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const toggleSelection = (id) => {
        setSelectedTickets(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const pageTickets = processedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        const pageIds = pageTickets.map(t => t.id);

        const allOnPageSelected = pageIds.every(id => selectedTickets.includes(id));

        if (allOnPageSelected) {
            setSelectedTickets(prev => prev.filter(id => !pageIds.includes(id)));
        } else {
            setSelectedTickets(prev => [...new Set([...prev, ...pageIds])]);
        }
    };

    const handleBulkAssign = () => {
        if (!bulkAgent) return;
        bulkUpdateTickets(selectedTickets, { assignedAgent: bulkAgent });
        setSuccessMessage(`Assigned ${selectedTickets.length} tickets to ${bulkAgent}`);
        setSelectedTickets([]);
        setBulkAgent('');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const columns = [
        { header: 'Ticket ID', field: 'id' },
        { header: 'Name', field: 'customerName' },
        { header: 'Phone', field: 'phone' },
        { header: 'Priority', render: (row) => <PriorityBadge priority={row.priority} /> },
        { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Source', field: 'source' },
        { header: 'Created', field: 'createdDate' }
    ];

    return (
        <div className="tickets-page">
            <PageHeader
                title="Support Tickets"
                subtitle="Manage and respond to customer requests"
                actionButtonLabel={
                    !isManager ? (
                        <div className="flex-center">
                            <Plus size={16} /><span className="ml-2">Create Ticket</span>
                        </div>
                    ) : null
                }
                onActionClick={() => navigate('/tickets/create')}
            />

            <div className="tickets-content mt-6">
                <div className="table-controls">
                    <div className="search-box-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or phone..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-presets">
                        <Filter size={16} className="filter-icon" />
                        {filters.map(f => (
                            <button
                                key={f.value}
                                className={`filter-chip ${statusFilter === f.value ? 'active' : ''}`}
                                onClick={() => { setStatusFilter(f.value); setCurrentPage(1); }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedTickets.length > 0 && (
                    <div className="bulk-action-bar-premium">
                        <div className="bulk-selection-info">
                            <Check size={16} className="text-primary" />
                            <span><strong>{selectedTickets.length}</strong> selected</span>
                        </div>
                        <div className="bulk-actions">
                            <select
                                className="bulk-select-input"
                                value={bulkAgent}
                                onChange={(e) => setBulkAgent(e.target.value)}
                            >
                                <option value="">Assign to...</option>
                                <option value="Support Member 1">Support Member 1</option>
                                <option value="Support Member 2">Support Member 2</option>
                                <option value="Support Member 3">Support Member 3</option>
                            </select>
                            <button className="btn-primary-small" onClick={handleBulkAssign} disabled={!bulkAgent}>
                                Apply Changes
                            </button>
                            <button className="btn-ghost-small" onClick={() => setSelectedTickets([])}>Cancel</button>
                        </div>
                    </div>
                )}

                {successMessage && (
                    <div className="status-toast-inline">
                        <Check size={16} /> <span>{successMessage}</span>
                    </div>
                )}

                <div className="premium-table-container card">
                    <DataTable
                        columns={columns}
                        data={processedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                        keyField="id"
                        selectable={true}
                        selectedRows={selectedTickets}
                        onSelectionChange={toggleSelection}
                        onSelectAll={toggleSelectAll}
                        onRowClick={(row) => navigate(`/tickets/${row.id}`)}
                        renderActions={(row) => (
                            <div className="table-actions-group">
                                <button
                                    className="action-btn-icon"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${row.id}`); }}
                                    title="View Details"
                                >
                                    <Eye size={16} />
                                </button>
                                {!isManager && row.status !== 'Closed' && (
                                    <button
                                        className="action-btn-icon close-btn"
                                        onClick={(e) => { e.stopPropagation(); handleQuickClose(row.id); }}
                                        title="Quick Close"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    />
                </div>

                <div className="pagination-wrapper mt-4">
                    <Pagination
                        totalItems={processedTickets.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tickets;
