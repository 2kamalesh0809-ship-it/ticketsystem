import React, { useMemo, useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Calendar, Filter, ChevronLeft, ChevronRight, Plus, User, Users, Zap, TrendingUp } from 'lucide-react';
import './AuditReport.css';

const AuditReport = () => {
    const { tickets = [] } = useTickets();

    // 1. Data Normalization & Simulation (Preserved from original logic)
    const normalizedTickets = useMemo(() => {
        return tickets.map(t => ({
            ...t,
            title: t.title || `Support req: ${t.customerName}`,
            createdBy: t.createdBy || 'System Admin',
            createdAt: t.createdAt || t.createdDate || '2026-02-23T10:00:00',
            assignedBy: t.assignedBy || 'Manager Sarah',
            assignedAgent: t.assignedAgent || 'Unassigned',
            assignedAt: t.assignedAt || (t.createdDate ? `${t.createdDate}T10:30:00` : '2026-02-23T10:30:00')
        }));
    }, [tickets]);

    // 2. Filter State
    const [filters, setFilters] = useState({
        createdBy: 'ALL',
        assignedBy: 'ALL',
        assignedTo: 'ALL',
        status: 'ALL'
    });

    // 3. Filtering Logic (Preserved)
    const filteredTickets = useMemo(() => {
        return normalizedTickets.filter(t => {
            const matchCreator = filters.createdBy === 'ALL' || t.createdBy === filters.createdBy;
            const matchAssigner = filters.assignedBy === 'ALL' || t.assignedBy === filters.assignedBy;
            const matchAssignee = filters.assignedTo === 'ALL' || t.assignedAgent === filters.assignedTo;
            const matchStatus = filters.status === 'ALL' || t.status === filters.status;
            return matchCreator && matchAssigner && matchAssignee && matchStatus;
        });
    }, [normalizedTickets, filters]);

    // 4. Aggregations (Preserved)
    const stats = useMemo(() => {
        const total = filteredTickets.length;

        const getMostActive = (field) => {
            if (filteredTickets.length === 0) return 'N/A';
            const counts = {};
            filteredTickets.forEach(t => {
                const val = t[field];
                if (val && val !== 'Unassigned') {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });
            const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
            return top ? top[0] : 'N/A';
        };

        const createdThisWeek = filteredTickets.filter(t => {
            const date = new Date(t.createdDate || t.createdAt);
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= sevenDaysAgo;
        }).length;

        return {
            totalCreated: total,
            mostActiveCreator: getMostActive('createdBy'),
            mostActiveAssigner: getMostActive('assignedBy'),
            mostAssignedAgent: getMostActive('assignedAgent'),
            createdThisWeek
        };
    }, [filteredTickets]);

    // 5. Chart Data (Preserved)
    const creatorChartData = useMemo(() => {
        const counts = {};
        filteredTickets.forEach(t => {
            counts[t.createdBy] = (counts[t.createdBy] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredTickets]);

    const assignmentChartData = useMemo(() => {
        const counts = {};
        filteredTickets.forEach(t => {
            if (t.assignedAgent !== 'Unassigned') {
                counts[t.assignedAgent] = (counts[t.assignedAgent] || 0) + 1;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredTickets]);

    const handleClearFilters = () => {
        setFilters({
            createdBy: 'ALL',
            assignedBy: 'ALL',
            assignedTo: 'ALL',
            status: 'ALL'
        });
    };

    return (
        <div className="audit-report-wrapper">
            {/* 1. Executive Header */}
            <header className="audit-header">
                <div className="audit-header-content">
                    <h1 className="audit-title">Audit Report</h1>
                    <p className="audit-subtitle">Monitor complete ticket creation and assignment lifecycle</p>
                </div>
                <div className="audit-header-actions">
                    <div className="date-range-badge">
                        <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        Feb 01, 2026 - Feb 23, 2026
                    </div>
                    <button className="btn-export-outline" onClick={() => alert('Exporting ticket reports...')}>
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </header>

            {/* 2. Premium Filter Section */}
            <section className="audit-filters-section">
                <h2 className="audit-section-title">Filters</h2>
                <div className="audit-card audit-card-premium">
                    <div className="audit-filters-grid">
                        <div className="audit-filter-group">
                            <span className="section-label">Date Range</span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="date" className="audit-input" defaultValue="2026-02-01" />
                                <span className="text-muted">–</span>
                                <input type="date" className="audit-input" defaultValue="2026-02-23" />
                            </div>
                        </div>
                        <div className="audit-filter-group">
                            <span className="section-label">Created By</span>
                            <select
                                className="audit-input"
                                value={filters.createdBy}
                                onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
                            >
                                <option value="ALL">All Users</option>
                                {[...new Set(normalizedTickets.map(t => t.createdBy))].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div className="audit-filter-group">
                            <span className="section-label">Assigned By</span>
                            <select
                                className="audit-input"
                                value={filters.assignedBy}
                                onChange={(e) => setFilters(prev => ({ ...prev, assignedBy: e.target.value }))}
                            >
                                <option value="ALL">All Assigners</option>
                                {[...new Set(normalizedTickets.map(t => t.assignedBy))].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div className="audit-filter-group">
                            <span className="section-label">Assigned To</span>
                            <select
                                className="audit-input"
                                value={filters.assignedTo}
                                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                            >
                                <option value="ALL">All Agents</option>
                                {[...new Set(normalizedTickets.map(t => t.assignedAgent))].filter(v => v !== 'Unassigned').map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div className="audit-filter-group">
                            <span className="section-label">Status</span>
                            <select
                                className="audit-input"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button className="clear-filters-btn" onClick={handleClearFilters}>Clear all filters</button>
                    </div>
                </div>
            </section>

            {/* 3. Stats Overview */}
            <section className="audit-overview-section">
                <h2 className="audit-section-title">Audit Overview</h2>
                <div className="audit-stats-grid">
                    <div className="audit-card">
                        <span className="section-label">Total Created</span>
                        <div className="stat-metric">{stats.totalCreated}</div>
                        <div className="stat-trend">Across selected filters</div>
                    </div>
                    <div className="audit-card">
                        <span className="section-label">Most Active Creator</span>
                        <div className="stat-metric" style={{ fontSize: stats.mostActiveCreator.length > 12 ? '20px' : '30px' }}>
                            {stats.mostActiveCreator}
                        </div>
                        <div className="stat-trend">Top contributor</div>
                    </div>
                    <div className="audit-card">
                        <span className="section-label">Most Active Assigner</span>
                        <div className="stat-metric" style={{ fontSize: stats.mostActiveAssigner.length > 12 ? '20px' : '30px' }}>
                            {stats.mostActiveAssigner}
                        </div>
                        <div className="stat-trend">Highest frequency</div>
                    </div>
                    <div className="audit-card">
                        <span className="section-label">Most Assigned Agent</span>
                        <div className="stat-metric" style={{ fontSize: stats.mostAssignedAgent.length > 12 ? '20px' : '30px' }}>
                            {stats.mostAssignedAgent}
                        </div>
                        <div className="stat-trend">Peak assignment</div>
                    </div>
                    <div className="audit-card">
                        <span className="section-label">Created (Week)</span>
                        <div className="stat-metric">{stats.createdThisWeek}</div>
                        <div className="stat-trend">Recent 7-day volume</div>
                    </div>
                </div>
            </section>

            {/* 4. Assignment Analytics */}
            <section className="audit-analytics-section">
                <h2 className="audit-section-title">Assignment Analytics</h2>
                <div className="audit-charts-grid">
                    <div className="audit-card">
                        <span className="chart-legend-text">Volume per user</span>
                        <h3 className="section-label" style={{ marginBottom: '16px' }}>Creation Distribution</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={creatorChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                                    />
                                    <Bar dataKey="value" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="audit-card">
                        <span className="chart-legend-text">Workload per agent</span>
                        <h3 className="section-label" style={{ marginBottom: '16px' }}>Assignment Distribution</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={assignmentChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                                    />
                                    <Bar dataKey="value" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Ticket Lifecycle Records */}
            <section className="audit-records-section">
                <div className="audit-table-header">
                    <h2 className="audit-section-title">Ticket Lifecycle Records</h2>
                    <span className="results-count">Showing {filteredTickets.length} records</span>
                </div>
                <div className="audit-table-wrapper">
                    {filteredTickets.length > 0 ? (
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Created By</th>
                                    <th>Created Date</th>
                                    <th>Assigned By</th>
                                    <th>Assigned To</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map(row => (
                                    <tr key={row.id}>
                                        <td style={{ fontWeight: '600' }}>{row.id}</td>
                                        <td>{row.title}</td>
                                        <td>{row.createdBy}</td>
                                        <td>{row.createdAt.split('T')[0]}</td>
                                        <td>{row.assignedBy}</td>
                                        <td>{row.assignedAgent}</td>
                                        <td><span className="badge-gray">{row.status}</span></td>
                                        <td><span className="badge-outline">{row.priority}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="audit-empty-state">
                            <div className="empty-icon-circle">
                                <FileText size={24} />
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0' }}>No audit records found</h4>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Try adjusting your filters.</p>
                        </div>
                    )}

                    {/* Minimal Pagination Footer */}
                    <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            Page 1 of 1
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-export-outline" style={{ padding: '6px' }} disabled><ChevronLeft size={16} /></button>
                            <button className="btn-export-outline" style={{ padding: '6px' }} disabled><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AuditReport;
