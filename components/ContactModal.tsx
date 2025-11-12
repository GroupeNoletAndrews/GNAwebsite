
import React from 'react';
import Modal from './Modal';
import ContactForm from './ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Contactez-Nous</h2>
      <p className="text-lg text-gray-400 mb-8 text-center">Laissez-nous un message et nous vous répondrons rapidement.</p>
      <ContactForm idPrefix="modal" />
    </Modal>
  );
};

export default ContactModal;
