import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import { useCustomers } from '../context/CustomerContext';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import TextInput from '../components/forms/TextInput';
import FormButton from '../components/forms/FormButton';
import { User, Plus, Check } from 'lucide-react';
import './Customers.css';

const Customers = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { customers, addCustomer } = useCustomers();

    const [filteredData, setFilteredData] = useState(customers);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const itemsPerPage = 10;

    // Keep filtered data in sync with context
    React.useEffect(() => {
        setFilteredData(customers);
    }, [customers]);

    if (user?.role === 'Manager') {
        return (
            <div className="customers-page" style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p className="text-muted mt-4">You do not have permission to view customer details.</p>
            </div>
        );
    }

    const handleSearch = (term) => {
        if (!term) return setFilteredData(customers);
        const lowerTerm = term.toLowerCase();
        const filtered = customers.filter(c =>
            c.name.toLowerCase().includes(lowerTerm) ||
            c.email.toLowerCase().includes(lowerTerm) ||
            c.phone.includes(lowerTerm)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleViewProfile = (id) => {
        navigate(`/customers/${id}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addCustomer(newCustomer);
        setIsModalOpen(false);
        setNewCustomer({ name: '', email: '', phone: '' });
        setSuccessMessage('Customer added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const columns = [
        { header: 'Customer Name', field: 'name' },
        { header: 'Phone', field: 'phone' },
        { header: 'Email', field: 'email' },
        { header: 'Total Tickets', field: 'totalTickets' },
        { header: 'Last Contact Date', field: 'lastContact' }
    ];

    return (
        <div className="customers-page">
            <PageHeader
                title="Customers"
                subtitle="Manage customer records"
                actionButtonLabel={
                    <div className="flex-center">
                        <Plus size={16} /><span className="ml-2">Add Customer</span>
                    </div>
                }
                onActionClick={() => setIsModalOpen(true)}
            />

            {successMessage && (
                <div className="status-toast-inline mt-4">
                    <Check size={16} /> <span>{successMessage}</span>
                </div>
            )}

            <div className="card mt-6">
                <FilterBar
                    searchPlaceholder="Search customers by name, email or phone..."
                    onSearchChange={handleSearch}
                />

                <DataTable
                    columns={columns}
                    data={filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
                    keyField="id"
                    onRowClick={(row) => handleViewProfile(row.id)}
                    renderActions={(row) => (
                        <button
                            className="btn-outline"
                            onClick={(e) => { e.stopPropagation(); handleViewProfile(row.id); }}
                        >
                            View Profile
                        </button>
                    )}
                />

                <Pagination
                    totalItems={filteredData.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Customer"
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <TextInput
                            label="Full Name"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleInputChange}
                            placeholder="Enter customer name"
                            required
                        />
                        <TextInput
                            label="Email Address"
                            name="email"
                            type="email"
                            value={newCustomer.email}
                            onChange={handleInputChange}
                            placeholder="customer@example.com"
                            required
                        />
                        <TextInput
                            label="Phone Number"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleInputChange}
                            placeholder="9876543210"
                            required
                        />
                        <div className="modal-actions-footer mt-6 flex justify-end gap-3">
                            <FormButton
                                type="button"
                                className="btn-ghost"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </FormButton>
                            <FormButton type="submit">
                                Save Customer
                            </FormButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
