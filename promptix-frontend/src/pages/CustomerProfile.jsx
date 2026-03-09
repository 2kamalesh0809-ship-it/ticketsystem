import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import { useTickets } from '../context/TicketContext';
import customerService from '../services/customerService';
import TwoColumnLayout from '../components/TwoColumnLayout';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import FormButton from '../components/forms/FormButton';
import { ArrowLeft, User, Phone, Mail, Calendar, Clock, Loader2 } from 'lucide-react';
import './CustomerProfile.css';

const CustomerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await customerService.getCustomerById(id);
                setCustomerDetail(data);
            } catch (error) {
                console.error('Error fetching customer details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-12 text-center"><Loader2 className="spin-icon mx-auto" /></div>;

    if (!customerDetail) {
        return (
            <div className="p-8 text-center">
                <h2>Customer not found</h2>
                <FormButton variant="outline" className="mt-4" onClick={() => navigate('/customers')}>
                    Back to Customers
                </FormButton>
            </div>
        );
    }

    const ticketColumns = [
        { header: 'Ticket ID', field: 'id' },
        {
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />
        },
        {
            header: 'Priority',
            render: (row) => <PriorityBadge priority={row.priority} />
        },
        { header: 'Date', field: 'createdDate' }
    ];

    const mappedTickets = (customerDetail.tickets || []).map(t => ({
        id: t.ticketId || t._id,
        status: t.status,
        priority: t.priority,
        createdDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''
    }));

    const mappedCalls = (customerDetail.callLogs || []).map(c => ({
        id: c.callId || c._id,
        type: c.type,
        duration: c.duration,
        date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
        agentName: c.agentId?.name || 'Unknown'
    }));

    return (
        <div className="customer-profile-page">
            <PageHeader
                titlePrefix={
                    <button className="btn-icon back-btn" onClick={() => navigate('/customers')}>
                        <ArrowLeft size={20} />
                    </button>
                }
                title={customerDetail.name}
                subtitle="Customer Profile & History"
            />

            <TwoColumnLayout
                leftContent={
                    <div className="card info-card">
                        <div className="profile-header-main">
                            <div className="profile-avatar-large">
                                <User size={48} />
                            </div>
                            <h2 className="mt-4">{customerDetail.name}</h2>
                        </div>

                        <div className="info-list mt-6">
                            <div className="info-item">
                                <div className="info-icon-box"><Phone size={18} /></div>
                                <div className="info-details">
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{customerDetail.phone}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon-box"><Mail size={18} /></div>
                                <div className="info-details">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{customerDetail.email}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-icon-box"><Calendar size={18} /></div>
                                <div className="info-details">
                                    <span className="info-label">Joined</span>
                                    <span className="info-value">{new Date(customerDetail.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stats-mini-grid mt-6">
                            <div className="mini-stat">
                                <span className="stat-label">Total Tickets</span>
                                <span className="stat-value">{mappedTickets.length}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="stat-label">Last Contact</span>
                                <span className="stat-value">{customerDetail.lastContact || 'Today'}</span>
                            </div>
                        </div>
                    </div>
                }
                rightContent={
                    <div className="profile-activity-tabs">
                        <div className="dashboard-section">
                            <h2 className="section-title">Ticket History</h2>
                            <div className="card">
                                <DataTable
                                    columns={ticketColumns}
                                    data={mappedTickets}
                                    keyField="id"
                                    onRowClick={(row) => navigate(`/tickets/${row.id}`)}
                                />
                                {mappedTickets.length === 0 && (
                                    <div className="text-center p-8 text-muted">
                                        No tickets found for this customer.
                                    </div>
                                ) || null}
                            </div>
                        </div>

                        <div className="dashboard-section mt-6">
                            <h2 className="section-title">Call History</h2>
                            <div className="card p-0">
                                <div className="call-logs-container">
                                    {mappedCalls.length > 0 ? mappedCalls.map(call => (
                                        <div key={call.id} className="call-item-simple">
                                            <div className="call-icon">
                                                <Clock size={16} />
                                            </div>
                                            <div className="call-info">
                                                <span className="call-id">{call.id} • {call.type}</span>
                                                <span className="call-meta">{call.date} • {call.duration}</span>
                                            </div>
                                            <div className="call-agent">
                                                <span>{call.agentName}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="p-4 text-center text-muted">No call logs available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default CustomerProfile;
