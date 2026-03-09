import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronRight,
    ArrowLeft,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Plus,
    User,
    UserCircle
} from 'lucide-react';
import TextInput from '../components/forms/TextInput';
import SelectInput from '../components/forms/SelectInput';
import TextArea from '../components/forms/TextArea';
import FormButton from '../components/forms/FormButton';
import PriorityBadge from '../components/PriorityBadge';
import { useTickets } from '../context/TicketContext';
import { useCustomers } from '../context/CustomerContext';
import './CreateTicket.css';

const CreateTicket = () => {
    const navigate = useNavigate();
    const { addTicket } = useTickets();
    const { customers } = useCustomers();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        subject: '',
        priority: 'Medium',
        category: 'General',
        assignedMember: '',
        description: ''
    });

    const [charCount, setCharCount] = useState(0);

    const priorityOptions = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' }
    ];

    const categoryOptions = [
        { value: 'General', label: 'General Enquiry' },
        { value: 'Technical', label: 'Technical Issue' },
        { value: 'Billing', label: 'Billing & Payments' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'description') {
            setCharCount(value.length);
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!isNewCustomer && !formData.customerId) {
            newErrors.customerId = 'Customer is required';
        }
        if (isNewCustomer) {
            if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
            if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [createdId, setCreatedId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const ticketPayload = {
                subject: formData.subject,
                priority: formData.priority,
                category: formData.category,
                description: formData.description,
                assignedMember: formData.assignedMember || null
            };

            if (isNewCustomer) {
                ticketPayload.customerName = formData.customerName;
                ticketPayload.customerEmail = formData.customerEmail;
                ticketPayload.customerPhone = formData.customerPhone;
            } else {
                ticketPayload.customerId = formData.customerId;
            }

            const newId = await addTicket(ticketPayload);

            setCreatedId(newId);
            setSuccess(true);
            setLoading(false);

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                navigate(`/dashboard`);
            }, 2000);
        } catch (error) {
            console.error('Failed to create ticket:', error);
            setLoading(false);
        }
    };

    return (
        <div className="create-ticket-page">
            <div className="create-ticket-container">
                <nav className="breadcrumb">
                    <Link to="/dashboard">Dashboard</Link>
                    <ChevronRight size={14} />
                    <Link to="/tickets">Tickets</Link>
                    <ChevronRight size={14} />
                    <span>New Ticket</span>
                </nav>

                <div className="page-header-simple">
                    <button className="btn-back-square" onClick={() => navigate('/tickets')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-text-group">
                        <h1 className="">Create New Ticket</h1>
                        <p>Link a customer or create a new one on-the-fly.</p>
                    </div>
                </div>

                <div className="create-ticket-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-body">
                            <div className="form-section">
                                <div className="section-header">
                                    <div className="section-icon"><User size={18} /></div>
                                    <h2>Customer Information</h2>
                                    <div className="customer-toggle-group">
                                        <button
                                            type="button"
                                            className={`toggle-btn ${!isNewCustomer ? 'active' : ''}`}
                                            onClick={() => setIsNewCustomer(false)}
                                        >
                                            Existing
                                        </button>
                                        <button
                                            type="button"
                                            className={`toggle-btn ${isNewCustomer ? 'active' : ''}`}
                                            onClick={() => setIsNewCustomer(true)}
                                        >
                                            New
                                        </button>
                                    </div>
                                </div>
                                <div className="form-grid">
                                    {!isNewCustomer ? (
                                        <div className={`form-field ${errors.customerId ? 'has-error' : ''}`}>
                                            <label>Select Customer <span className="required">*</span></label>
                                            <select
                                                name="customerId"
                                                value={formData.customerId}
                                                onChange={handleChange}
                                                className="input-premium"
                                            >
                                                <option value="">Choose a customer...</option>
                                                {customers.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                                                ))}
                                            </select>
                                            {errors.customerId && <span className="error-msg">{errors.customerId}</span>}
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`form-field ${errors.customerName ? 'has-error' : ''}`}>
                                                <label>Customer Name <span className="required">*</span></label>
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    placeholder="Enter name"
                                                    value={formData.customerName}
                                                    onChange={handleChange}
                                                    className="input-premium"
                                                />
                                                {errors.customerName && <span className="error-msg">{errors.customerName}</span>}
                                            </div>
                                            <div className={`form-field ${errors.customerEmail ? 'has-error' : ''}`}>
                                                <label>Customer Email <span className="required">*</span></label>
                                                <input
                                                    type="email"
                                                    name="customerEmail"
                                                    placeholder="Enter email"
                                                    value={formData.customerEmail}
                                                    onChange={handleChange}
                                                    className="input-premium"
                                                />
                                                {errors.customerEmail && <span className="error-msg">{errors.customerEmail}</span>}
                                            </div>
                                            <div className="form-field">
                                                <label>Customer Phone</label>
                                                <input
                                                    type="tel"
                                                    name="customerPhone"
                                                    placeholder="Enter phone"
                                                    value={formData.customerPhone}
                                                    onChange={handleChange}
                                                    className="input-premium"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className={`form-field ${errors.subject ? 'has-error' : ''} ${isNewCustomer ? 'full-width' : ''}`}>
                                        <label>Subject / Title <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Brief summary of the issue"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="input-premium"
                                        />
                                        {errors.subject && <span className="error-msg">{errors.subject}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <div className="section-header">
                                    <div className="section-icon"><AlertCircle size={18} /></div>
                                    <h2>Classification</h2>
                                </div>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Priority</label>
                                        <div className="priority-select-premium-container">
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                className="input-premium"
                                            >
                                                {priorityOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                            <PriorityBadge priority={formData.priority} />
                                        </div>
                                    </div>

                                    <div className="form-field">
                                        <label>Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="input-premium"
                                        >
                                            {categoryOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={`form-field full-width ${errors.description ? 'has-error' : ''}`}>
                                        <div className="label-header">
                                            <label>Description & Notes <span className="required">*</span></label>
                                            <span className={`char-counter ${charCount > 450 ? 'near-limit' : ''}`}>
                                                {charCount}/500
                                            </span>
                                        </div>
                                        <textarea
                                            name="description"
                                            placeholder="Detailed information about the request..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="input-premium textarea-premium"
                                        ></textarea>
                                        {errors.description && <span className="error-msg">{errors.description}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer-actions">
                            <button
                                type="button"
                                className="btn-glass-cancel"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-premium-submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="spin-icon" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Create Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {success && (
                <div className="success-toast-premium">
                    <div className="toast-icon-wrapper">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="toast-content">
                        <h3>Ticket Created Successfully</h3>
                        <p>Ticket #{createdId} has been registered. Redirecting...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTicket;
