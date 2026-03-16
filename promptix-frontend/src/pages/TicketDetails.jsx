import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import PageHeader from '../components/PageHeader';
import TextArea from '../components/forms/TextArea';
import FormButton from '../components/forms/FormButton';
import { useTickets } from '../context/TicketContext';
import userService from '../services/userService';
import {
    ArrowLeft,
    Send,
    User,
    Mail,
    Phone,
    Calendar,
    Clock,
    MessageSquare,
    History,
    CheckCircle2,
    ShieldAlert,
    ChevronRight,
    UserCircle,
    Activity,
    Settings,
    PlusCircle,
    Link2,
    Paperclip,
    FileImage
} from 'lucide-react';
import './TicketDetails.css';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tickets, updateTicket, addNoteTemplate } = useTickets();
    const { user } = useAuth();

    const ticket = tickets.find(t => t.id === id);
    const isManager = user?.role === 'Manager';
    const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [agent, setAgent] = useState('');
    const [noteText, setNoteText] = useState('');
    const [staffMembers, setStaffMembers] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const users = await userService.getAllUsers();
                setStaffMembers(users);
            } catch (err) {
                console.error('Failed to fetch staff members:', err);
            }
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status || 'Open');
            setPriority(ticket.priority || 'Medium');
            setAgent(ticket.assignedAgentId || 'Unassigned');
        }
    }, [ticket]);

    if (!ticket) {
        return (
            <div className="ticket-not-found">
                <div className="empty-state-card">
                    <ShieldAlert size={48} />
                    <h2>Ticket Not Found</h2>
                    <p>We couldn't find the ticket with ID: <strong>{id}</strong></p>
                    <button className="btn-primary mt-4" onClick={() => navigate('/tickets')}>
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    const handleSaveChanges = async () => {
        setUpdating(true);
        setSaveStatus(null);
        try {
            await updateTicket(ticket.id, {
                status,
                priority,
                assignedMember: agent === 'Unassigned' ? null : agent
            });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Failed to save changes:', error);
            setSaveStatus('error');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        addNoteTemplate(ticket.id, noteText, user?.name || 'Unknown User');
        setNoteText('');
    };

    const getTimelineIcon = (action) => {
        if (action.includes('Created')) return <PlusCircle size={14} />;
        if (action.includes('Status')) return <Activity size={14} />;
        if (action.includes('Assigned')) return <UserCircle size={14} />;
        return <Clock size={14} />;
    };

    return (
        <div className="ticket-details-page-premium">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb-nav">
                <Link to="/dashboard">Dashboard</Link>
                <ChevronRight size={14} />
                <Link to="/tickets">Tickets</Link>
                <ChevronRight size={14} />
                <span>Ticket #{ticket.id}</span>
            </nav>

            <div className="details-header-premium">
                <button className="back-circle-btn" onClick={() => navigate('/tickets')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-main-info">
                    <div className="title-row">
                        <h1>Ticket {ticket.id}</h1>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                        {ticket.source && (
                            <span style={{ marginLeft: '12px', fontSize: '13px', padding: '4px 10px', background: 'var(--bg-main)', borderRadius: '20px', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: '600' }}>
                                Source: {ticket.source}
                            </span>
                        )}
                    </div>
                    <p className="created-text">
                        <Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        Opened on {new Date(ticket.createdAt || ticket.createdDate).toLocaleDateString()}
                        <span style={{ margin: '0 8px', color: 'var(--border-hover)' }}>|</span>
                        Requester: <strong>{ticket.customerName}</strong>
                    </p>
                </div>
            </div>

            <div className="details-grid-premium">
                <div className="details-main-column">
                    {/* Requester Information Card */}
                    <div className="premium-card">
                        <div className="card-header-iconized">
                            <div className="header-icon"><User size={20} /></div>
                            <h2>Requester Overview ({ticket.userType || 'Client'})</h2>
                        </div>
                        <div className="card-content-p">
                            <div className="info-horizontal-grid">
                                <div className="info-box">
                                    <span className="box-label">Full Name</span>
                                    <div className="box-value-with-icon">
                                        <UserCircle size={16} className="box-value-icon" />
                                        <span>{ticket.customerName}</span>
                                    </div>
                                </div>
                                {ticket.userType === 'Coach' ? (
                                    <div className="info-box">
                                        <span className="box-label">Coach ID</span>
                                        <div className="box-value-with-icon">
                                            <ShieldAlert size={16} className="box-value-icon" />
                                            <span>{ticket.coachId}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="info-box">
                                            <span className="box-label">Email Address</span>
                                            <div className="box-value-with-icon">
                                                <Mail size={16} className="box-value-icon" />
                                                <span>{ticket.email || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="info-box">
                                            <span className="box-label">Phone Number</span>
                                            <div className="box-value-with-icon">
                                                <Phone size={16} className="box-value-icon" />
                                                <span>{ticket.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="description-section">
                                <span className="box-label">Subject: {ticket.subject}</span>
                                <div className="description-paper">
                                    {ticket.description}
                                </div>
                            </div>

                            {(ticket.gdriveLink || (ticket.attachments && ticket.attachments.length > 0)) && (
                                <div className="attachments-section" style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--bg-main)' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Paperclip size={16} /> Attachments & Links
                                    </h3>

                                    {ticket.gdriveLink && (
                                        <div style={{ marginBottom: '12px' }}>
                                            <a href={ticket.gdriveLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f0fdf4', color: '#166534', borderRadius: '6px', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
                                                <Link2 size={16} /> View Google Drive Files
                                            </a>
                                        </div>
                                    )}

                                    {ticket.attachments && ticket.attachments.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                            {ticket.attachments.map((file, idx) => (
                                                <a key={idx} href={`https://promptix-backend-uxgf.onrender.com${file}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '13px' }}>
                                                    <FileImage size={16} color="var(--primary)" />
                                                    Attachment {idx + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Management Actions Card */}
                    <div className="premium-card">
                        <div className="card-header-iconized">
                            <div className="header-icon"><Settings size={20} /></div>
                            <h2>Ticket Resolution Controls</h2>
                        </div>
                        <div className="actions-flex-grid">
                            <div className="action-field">
                                <label>Current Status</label>
                                <select className="premium-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div className="action-field">
                                <label>Severity Level</label>
                                <select className="premium-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div className="action-field">
                                <label>Assigned Staff</label>
                                <select className="premium-select" value={agent} onChange={(e) => setAgent(e.target.value)}>
                                    <option value="Unassigned">Waiting for Assignment</option>
                                    {staffMembers.map(member => (
                                        <option key={member._id} value={member._id}>
                                            {member.name} ({member.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="save-footer">
                            <button
                                className={`btn-primary-glow ${saveStatus === 'success' ? 'btn-success' : ''} ${saveStatus === 'error' ? 'btn-error' : ''}`}
                                onClick={handleSaveChanges}
                                disabled={updating}
                            >
                                {updating ? 'Saving...' :
                                    saveStatus === 'success' ? 'Changes Saved!' :
                                        saveStatus === 'error' ? 'Failed to Save' :
                                            'Save Updated Parameters'}
                            </button>
                        </div>
                    </div>

                    {/* Internal Communications Card */}
                    <div className="premium-card">
                        <div className="card-header-iconized">
                            <div className="header-icon"><MessageSquare size={20} /></div>
                            <h2>Staff Discussion Thread</h2>
                        </div>

                        <div className="notes-stream">
                            {ticket.notes && ticket.notes.length > 0 ? (
                                ticket.notes.map(note => {
                                    const staff = staffMembers.find(s => s.name === note.author);
                                    return (
                                        <div key={note.id} className="note-bubble-premium manager-note">
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <div className="avatar-mini" style={{
                                                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee',
                                                    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                }}>
                                                    {staff?.avatar ? (
                                                        <img src={`${API_BASE_URL}${staff.avatar}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <User size={16} color="#94a3b8" />
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="note-meta">
                                                        <span className="note-author">{note.author}</span>
                                                        <span className="note-time">{new Date(note.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    <p className="note-text">{note.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                                    <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                                    <p>No internal notes have been recorded yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="add-note-inline">
                            <textarea
                                className="note-textarea"
                                placeholder="Type an internal note for the team..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            />
                            <button className="send-note-circle" onClick={handleAddNote}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="details-sidebar-column">
                    {/* Activity Timeline Card */}
                    <div className="premium-card">
                        <div className="card-header-iconized">
                            <div className="header-icon"><Activity size={20} /></div>
                            <h2>Audit Trail</h2>
                        </div>
                        <div className="activity-stream">
                            {ticket.history && ticket.history.length > 0 ? (
                                ticket.history.map((h, i) => (
                                    <div key={h.id || i} className="timeline-item">
                                        <div className="timeline-visual">
                                            <div className="timeline-dot">
                                                {getTimelineIcon(h.action)}
                                            </div>
                                            {i !== ticket.history.length - 1 && <div className="timeline-line"></div>}
                                        </div>
                                        <div className="timeline-content">
                                            <p className="timeline-action">{h.action}</p>
                                            <span className="timeline-time">
                                                {new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-light)', padding: '0 24px 24px' }}>No activity stream available.</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="premium-card">
                        <div className="card-header-iconized">
                            <div className="header-icon"><CheckCircle2 size={20} /></div>
                            <h2>Summary</h2>
                        </div>
                        <div className="quick-stats-grid">
                            <div className="sidebar-stat-row">
                                <Clock size={16} className="stat-icon" />
                                <span>Total Age</span>
                                <strong>2 days</strong>
                            </div>
                            <div className="sidebar-stat-row">
                                <UserCircle size={16} className="stat-icon" />
                                <span>Staff Member</span>
                                <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {ticket.assignedAgent === 'Unassigned' ? 'N/A' : (
                                        <>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                {staffMembers.find(s => s.name === ticket.assignedAgent || s._id === ticket.assignedAgentId)?.avatar ? (
                                                    <img
                                                        src={`${API_BASE_URL}${staffMembers.find(s => s.name === ticket.assignedAgent || s._id === ticket.assignedAgentId).avatar}`}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : <User size={10} />}
                                            </div>
                                            {ticket.assignedAgent}
                                        </>
                                    )}
                                </strong>
                            </div>
                            <div className="sidebar-stat-row">
                                <Activity size={16} className="stat-icon" />
                                <span>Updates</span>
                                <strong>{ticket.history?.length || 0}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
