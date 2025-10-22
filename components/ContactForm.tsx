import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { CursorHover } from './Cursor';

interface ContactFormProps {
  idPrefix: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ idPrefix }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.name && formData.email && formData.message) {
      setStatus('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } else {
      setStatus('Veuillez remplir tous les champs.');
      setTimeout(() => setStatus(''), 3000);
    }
    setIsSubmitting(false);
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
    focus: { scale: 1.02, boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)' },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-10"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Nom */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-name`} className="sr-only">
          Nom
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <input
              type="text"
              name="name"
              id={`${idPrefix}-name`}
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Votre nom"
              className="relative w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl py-5 px-8 text-white placeholder-gray-400 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg"
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-white to-transparent"
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'name' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
      </motion.div>

      {/* Email */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-email`} className="sr-only">
          Email
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <input
              type="email"
              name="email"
              id={`${idPrefix}-email`}
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="Votre email"
              className="relative w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl py-5 px-8 text-white placeholder-gray-400 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg"
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-white to-transparent"
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'email' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
      </motion.div>

      {/* Message */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-message`} className="sr-only">
          Message
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <textarea
              name="message"
              id={`${idPrefix}-message`}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              placeholder="Parlez-nous de votre projet..."
              className="relative w-full bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-300 text-lg resize-none"
            />
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-white to-transparent"
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'message' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
      </motion.div>

      {/* Bouton et Status */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={fieldVariants}
      >
        <CursorHover>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative bg-gradient-to-r from-white to-gray-200 text-black font-bold py-4 px-8 rounded-xl hover:from-gray-200 hover:to-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                  Envoyer le message
                </>
              )}
            </span>
          </motion.button>
        </CursorHover>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`text-sm font-medium px-4 py-2 rounded-lg ${
                status.includes('succès')
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {status}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.form>
  );
};

export default ContactForm;
