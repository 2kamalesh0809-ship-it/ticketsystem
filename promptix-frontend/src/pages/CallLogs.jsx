import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import callLogService from '../services/callLogService';
import AddCallLogModal from '../components/AddCallLogModal';
import { PhoneCall, Play, Mic, Plus, FileAudio } from 'lucide-react';
import './CallLogs.css';

const CallLogs = () => {
    const { user } = useAuth();
    const { tickets } = useTickets();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        type: 'ALL',
        agentName: 'ALL',
        ticketStatus: 'ALL'
    });
    const itemsPerPage = 10;

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const logs = await callLogService.getAllCallLogs();
            setAllLogs(logs);
            setData(logs);
        } catch (error) {
            console.error('Error fetching call logs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchLogs();
        }
    }, [user, fetchLogs]);

    const filters = [
        {
            key: 'type',
            placeholder: 'Filter by Call Type',
            options: [
                { label: 'Inbound', value: 'Inbound' },
                { label: 'Outbound', value: 'Outbound' }
            ]
        },
        {
            key: 'agentName',
            placeholder: 'Filter by Member',
            options: [
                { label: 'Support Member 1', value: 'Support Member 1' },
                { label: 'Support Member 2', value: 'Support Member 2' }
            ]
        },
        {
            key: 'ticketStatus',
            placeholder: 'Filter by Ticket Status',
            options: [
                { label: 'Open', value: 'Open' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Resolved', value: 'Resolved' }
            ]
        }
    ];

    const applyFilters = (newFilters) => {
        let filtered = [...allLogs];

        if (newFilters.type !== 'ALL') {
            filtered = filtered.filter(item => item.type === newFilters.type);
        }

        if (newFilters.agentName !== 'ALL') {
            filtered = filtered.filter(item => item.agentName === newFilters.agentName);
        }

        if (newFilters.ticketStatus !== 'ALL') {
            filtered = filtered.filter(item => item.ticketStatus === newFilters.ticketStatus);
        }

        setData(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...activeFilters, [key]: value };
        setActiveFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const getTypeBadge = (type) => {
        if (type === 'Inbound') return <span className="type-badge inbound-badge">Inbound</span>;
        return <span className="type-badge outbound-badge">Outbound</span>;
    };

    const columns = [
        { header: 'CALL ID', field: 'id' },
        { header: 'TYPE', render: (row) => getTypeBadge(row.type) },
        { header: 'DURATION', field: 'duration' },
        {
            header: 'LINKED TICKET',
            render: (row) => row.linkedTicket ? (
                <Link to={`/tickets/${row.ticketId || row.linkedTicket}`} className="ticket-link">
                    {row.linkedTicket}
                </Link>
            ) : '—'
        },
        {
            header: 'TICKET STATUS',
            render: (row) => row.ticketStatus ? <StatusBadge status={row.ticketStatus} /> : '—'
        },
        { header: 'SUPPORT MEMBER', field: 'agentName' },
        { header: 'DATE', field: 'date' },
        {
            header: 'ACTION',
            render: (row) => row.recordingUrl ? (
                <div className="flex items-center gap-2">
                    <audio controls className="mini-player">
                        <source src={row.recordingUrl} type="audio/mpeg" />
                        <source src={row.recordingUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
                <span className="text-muted italic">No Recording</span>
            )
        }
    ];

    return (
        <div className="call-logs-page">
            <PageHeader
                title="Call Logs"
                subtitle="Track support team call activities"
                actionButtonLabel={
                    <div className="flex items-center gap-2">
                        <Plus size={16} /> <span>Add Call Log</span>
                    </div>
                }
                onActionClick={() => setIsModalOpen(true)}
            />

            <div className="call-logs-content mt-6">
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    searchPlaceholder="Search calls..."
                />

                {loading ? (
                    <div className="flex-center p-12">Loading call logs...</div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                            keyField="mongoId"
                        />

                        {data.length === 0 && (
                            <div className="p-12 text-center text-muted card bg-white">
                                <FileAudio size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No call logs found matching your criteria.</p>
                            </div>
                        )}

                        <Pagination
                            totalItems={data.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            <AddCallLogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchLogs}
            />
        </div>
    );
};

export default CallLogs;
