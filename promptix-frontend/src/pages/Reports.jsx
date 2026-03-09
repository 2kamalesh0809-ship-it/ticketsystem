import React, { useMemo, useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import TwoColumnLayout from '../components/TwoColumnLayout';
import reportService from '../services/reportService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Clock, Ticket, CheckCircle, PieChart as PieIcon, BarChart3, Calendar, TrendingUp, Plus, RefreshCw, AlertTriangle, Users, User, Zap, Trophy } from 'lucide-react';
import './Reports.css';

const COLORS = ['#2563eb', '#f97316', '#22c55e', '#64748b'];

const Reports = () => {
    const { user } = useAuth();
    const { tickets } = useTickets();

    const [activeTab, setActiveTab] = useState('agent');
    const [performanceData, setPerformanceData] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'weekly', label: 'Weekly Report', icon: Clock },
        { id: 'monthly', label: 'Monthly Report', icon: Calendar },
        { id: 'agent', label: 'Member Performance', icon: BarChart3 },
        { id: 'status', label: 'Status Distribution', icon: PieIcon },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [perf, dash] = await Promise.all([
                    reportService.getPerformanceStats(),
                    reportService.getDashboardStats()
                ]);
                setPerformanceData(perf);
                setDashboardData(dash);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role !== 'Support Member') {
            fetchStats();
        }
    }, [user]);

    const agentTableColumns = [
        { header: 'Member Name', field: 'name' },
        { header: 'Assigned', field: 'assigned' },
        { header: 'Closed', field: 'closed' },
        { header: 'Open', field: 'open' },
        {
            header: 'Score %',
            render: (row) => (
                <div className="flex-center gap-2">
                    <div className="progress-bar-mini">
                        <div className="progress-fill" style={{ width: `${row.score}%` }}></div>
                    </div>
                    <span>{Math.round(row.score)}%</span>
                </div>
            )
        }
    ];

    const weeklyData = useMemo(() => {
        const stats = {
            created: tickets.length,
            closed: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
            carryForward: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
            avgTime: dashboardData?.stats?.averageResolutionTime || "0h"
        };

        const statusCounts = {};
        tickets.forEach(t => {
            statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
        });

        const pieData = Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] }));

        return { stats, pieData };
    }, [tickets, dashboardData]);

    if (user?.role === 'Support Member') {
        return (
            <div className="reports-page denied-view">
                <div className="card text-center p-12">
                    <h2 className="text-xl">Access Denied</h2>
                    <p className="text-muted mt-2">Only administrators and managers can view enterprise performance analytics.</p>
                </div>
            </div>
        );
    }

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

    const renderReportContent = () => {
        switch (activeTab) {
            case 'weekly':
                return (
                    <div className="report-content-fade">
                        <div className="stats-grid-4 mb-6">
                            <StatsCard title="Tickets Created" value={weeklyData.stats.created} icon={Plus} trend={0} />
                            <StatsCard title="Tickets Closed" value={weeklyData.stats.closed} icon={CheckCircle} trend={0} />
                            <StatsCard title="Avg Resolution" value={weeklyData.stats.avgTime} icon={Clock} trend={0} />
                            <StatsCard title="Carry Forward" value={weeklyData.stats.carryForward} icon={TrendingUp} trend={0} />
                        </div>
                        <div className="card p-6">
                            <h3 className="section-title mb-6">Status Distribution (Weekly)</h3>
                            <div className="chart-h">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={weeklyData.pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {weeklyData.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            case 'agent':
                return (
                    <div className="report-content-fade">
                        <div className="card p-6 mb-6">
                            <h3 className="section-title mb-6">Performance Ranking (Tickets Closed)</h3>
                            <div className="chart-h" style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip />
                                        <Bar dataKey="closed" fill="var(--primary)" barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="mt-8">
                            <DataTable columns={agentTableColumns} data={performanceData} keyField="name" />
                        </div>
                    </div>
                );
            case 'status':
                return (
                    <div className="report-content-fade">
                        <div className="card p-8 mb-6 text-center">
                            <h3 className="section-title mb-8">Overall Status Distribution</h3>
                            <div className="chart-h" style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboardData?.statusDistribution || []}
                                            innerRadius={80}
                                            outerRadius={120}
                                            dataKey="value"
                                        >
                                            {(dashboardData?.statusDistribution || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="reports-page">
            <PageHeader
                title="Reports"
                subtitle="Analytics and performance insights"
            />
            <div className="reports-tabs section-spacing">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon && <tab.icon size={16} className="tab-icon" />}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="report-content-wrapper">
                {renderReportContent()}
            </div>
        </div>
    );
};

export default Reports;
