import React from 'react';
import './Modal.css';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footerActions }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content card">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>

                {footerActions && (
                    <div className="modal-footer">
                        {footerActions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
