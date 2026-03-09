import React, { useState, useEffect } from 'react';
import { useCustomers } from '../context/CustomerContext';
import { useTickets } from '../context/TicketContext';
import callLogService from '../services/callLogService';
import Modal from './Modal';
import TextInput from './forms/TextInput';
import SelectInput from './forms/SelectInput';
import TextArea from './forms/TextArea';
import FormButton from './forms/FormButton';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';

const AddCallLogModal = ({ isOpen, onClose, onSuccess }) => {
    const { customers } = useCustomers();
    const { tickets } = useTickets();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        ticketId: '',
        type: 'Inbound',
        duration: '',
        summary: '',
        recordingFile: null
    });

    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, recordingFile: file }));
            setFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('customerId', formData.customerId);
            if (formData.ticketId) data.append('ticketId', formData.ticketId);
            data.append('type', formData.type);
            data.append('duration', formData.duration);
            data.append('summary', formData.summary);
            if (formData.recordingFile) {
                data.append('recordingFile', formData.recordingFile);
            }

            await callLogService.createCallLog(data);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create call log:', error);
            alert('Error creating call log');
        } finally {
            setLoading(false);
        }
    };

    // Filter tickets based on selected customer
    const filteredTickets = tickets.filter(t => t.customerId === formData.customerId || t.customerName === customers.find(c => c.id === formData.customerId)?.name);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Support Call">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <SelectInput
                            label="Customer Name"
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleChange}
                            required
                            options={[
                                { label: 'Select Customer', value: '' },
                                ...customers.map(c => ({ label: c.name, value: c.id }))
                            ]}
                        />
                    </div>

                    <div className="col-span-1">
                        <SelectInput
                            label="Call Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            options={[
                                { label: 'Inbound', value: 'Inbound' },
                                { label: 'Outbound', value: 'Outbound' }
                            ]}
                        />
                    </div>

                    <div className="col-span-1">
                        <TextInput
                            label="Duration (minutes)"
                            name="duration"
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <SelectInput
                            label="Linked Ticket (Optional)"
                            name="ticketId"
                            value={formData.ticketId}
                            onChange={handleChange}
                            options={[
                                { label: 'No Ticket Linked', value: '' },
                                ...filteredTickets.map(t => ({ label: `[${t.id}] ${t.subject}`, value: t.mongoId || t.id }))
                            ]}
                        />
                    </div>

                    <div className="col-span-2">
                        <TextArea
                            label="Call Summary / Notes"
                            name="summary"
                            placeholder="Briefly describe what was discussed during the call..."
                            value={formData.summary}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Call Recording (.mp3, .wav, .m4a)</label>
                        <div className="flex items-center gap-4">
                            <label className="btn btn-outline flex items-center gap-2 cursor-pointer">
                                <Upload size={16} />
                                <span>Upload Audio</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".mp3,.wav,.m4a"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {fileName && (
                                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    <CheckCircle size={14} />
                                    <span>{fileName}</span>
                                    <button onClick={() => { setFileName(''); setFormData(p => ({ ...p, recordingFile: null })); }} type="button">
                                        <X size={14} className="text-gray-400" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                    <FormButton variant="outline" onClick={onClose} type="button" disabled={loading}>
                        Cancel
                    </FormButton>
                    <FormButton type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                        <span>{loading ? 'Processing...' : 'Register Call Log'}</span>
                    </FormButton>
                </div>
            </form>
        </Modal>
    );
};

export default AddCallLogModal;
