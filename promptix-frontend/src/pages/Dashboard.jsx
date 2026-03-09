import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useTickets } from '../context/TicketContext';
import {
    Ticket,
    Clock,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    LayoutDashboard
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { tickets } = useTickets();

    const handleRowClick = (row) => {
        navigate(`/tickets/${row.id}`);
    };

    const columns = [
        { header: 'Ticket ID', field: 'id' },
        { header: 'Customer', field: 'customerName' },
        {
            header: 'Priority',
            render: (row) => <PriorityBadge priority={row.priority} />
        },
        {
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />
        },
        { header: 'Source', field: 'source' },
        { header: 'Date', field: 'createdDate' }
    ];

    // Compute statistics from global context
    const stats = useMemo(() => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'Open').length;
        const highPriority = tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
        const closed = tickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;

        // Recently created tickets (last 5)
        const recent = [...tickets]
            .sort((a, b) => new Date(b.createdAt || b.createdDate) - new Date(a.createdAt || a.createdDate))
            .slice(0, 5);

        // Chart Data
        const inProgress = tickets.filter(t => t.status === 'In Progress').length;
        const distribution = [
            { name: 'Open', value: open, color: '#3b82f6' },
            { name: 'Active', value: inProgress, color: '#f97316' },
            { name: 'Resolved', value: closed, color: '#22c55e' }
        ];

        return { total, open, highPriority, closed, recent, distribution };
    }, [tickets]);

    return (
        <div className="dashboard-page">
            <div className="dashboard-welcome">
                <div className="welcome-text">
                    <h1 className="page-title-main">Dashboard Overview</h1>
                    <p className="page-subtitle-main">Monitor your support health and team performance</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/tickets/create')}>
                    <Ticket size={16} />
                    <span>New Ticket</span>
                </button>
            </div>

            <div className="stats-grid mt-6">
                <StatsCard
                    title="Total Tickets"
                    value={stats.total}
                    icon={LayoutDashboard}
                    trend={12.5}
                />
                <StatsCard
                    title="Open Tickets"
                    value={stats.open}
                    icon={Clock}
                    trend={-2.4}
                />
                <StatsCard
                    title="High Priority"
                    value={stats.highPriority}
                    icon={AlertTriangle}
                    trend={5.1}
                />
                <StatsCard
                    title="Closed & Resolved"
                    value={stats.closed}
                    icon={CheckCircle2}
                    trend={8.2}
                />
            </div>

            <div className="dashboard-content-grid mt-8">
                <div className="content-main">
                    <div className="content-header">
                        <h2 className="section-title-premium">Recent Support Requests</h2>
                        <button className="text-btn" onClick={() => navigate('/tickets')}>View All Tickets</button>
                    </div>
                    <div className="premium-card">
                        <DataTable
                            columns={columns}
                            data={stats.recent}
                            keyField="id"
                            onRowClick={handleRowClick}
                        />
                    </div>
                </div>

                <div className="content-sidebar">
                    <div className="content-header">
                        <h2 className="section-title-premium">Status distribution</h2>
                    </div>
                    <div className="premium-card chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stats.distribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13 }}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 4 }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                    {stats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="chart-legend">
                            {stats.distribution.map((item, i) => (
                                <div key={i} className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                                    <span className="legend-name">{item.name}</span>
                                    <span className="legend-value">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
