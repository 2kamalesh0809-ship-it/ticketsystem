import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import PageHeader from '../components/PageHeader';
import {
    Clock,
    CheckCircle2,
    PlayCircle,
    MessageSquare,
    User,
    AlertCircle
} from 'lucide-react';
import './AgentView.css';

const SupportMemberView = () => {
    const navigate = useNavigate();
    const { tickets, updateTicket } = useTickets();
    const { user } = useAuth();

    const myTickets = useMemo(() => {
        return tickets.filter(t => t.assignedAgent === user?.name);
    }, [tickets, user]);

    const handleStatusChange = (id, newStatus) => {
        updateTicket(id, { status: newStatus });
    };

    return (
        <div className="agent-view-page">
            <PageHeader
                title="My Assigned Tickets"
                subtitle={`Welcome back, ${user?.name}. You have ${myTickets.length} active assignments.`}
            />

            <div className="agent-tickets-grid mt-6">
                {myTickets.length > 0 ? (
                    myTickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card-premium">
                            <div className="card-header-flex">
                                <span className="ticket-id-tag">{ticket.id}</span>
                                <PriorityBadge priority={ticket.priority} />
                            </div>

                            <div className="card-body-content">
                                <h3 className="customer-name-card">
                                    <User size={16} className="mr-2" />
                                    {ticket.customerName}
                                </h3>
                                <p className="ticket-description-preview">
                                    {ticket.description || "No description provided for this ticket."}
                                </p>
                            </div>

                            <div className="card-status-section">
                                <div className="current-status-info">
                                    <span className="label-tiny">Current Status</span>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <div className="status-actions-group">
                                    <button
                                        className={`status-btn btn-progress ${ticket.status === 'In Progress' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(ticket.id, 'In Progress')}
                                        disabled={ticket.status === 'In Progress'}
                                        title="Set to In Progress"
                                    >
                                        <PlayCircle size={18} />
                                    </button>
                                    <button
                                        className={`status-btn btn-resolve ${ticket.status === 'Closed' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(ticket.id, 'Closed')}
                                        disabled={ticket.status === 'Closed'}
                                        title="Mark as Closed"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                    <button
                                        className={`status-btn btn-reopen ${ticket.status === 'Open' ? 'active' : ''}`}
                                        onClick={() => handleStatusChange(ticket.id, 'Open')}
                                        disabled={ticket.status === 'Open'}
                                        title="Re-open Ticket"
                                    >
                                        <Clock size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="card-footer-meta">
                                <span className="meta-item">
                                    <AlertCircle size={14} className="mr-1" />
                                    Added {ticket.createdDate}
                                </span>
                                <button className="btn-view-details" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tickets-assigned card">
                        <MessageSquare size={48} className="empty-icon" />
                        <h3>No tickets assigned to you yet</h3>
                        <p>When a manager assigns you a ticket, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportMemberView;
