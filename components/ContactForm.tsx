import dotenv from 'dotenv';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import * as yup from 'yup';
import { CursorHover } from './Cursor';
dotenv.config();
interface ContactFormProps {
  idPrefix: string;
}

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Schéma de validation
const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom ne doit contenir que des lettres'),
  lastName: yup
    .string()
    .required('Le nom de famille est requis')
    .min(2, 'Le nom de famille doit contenir au moins 2 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom de famille ne doit contenir que des lettres'),
  phone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(
      /^[\d\s()-]+$/,
      'Le numéro de téléphone doit contenir uniquement des chiffres, espaces, parenthèses et tirets'
    )
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  email: yup.string().required("L'email est requis").email('Veuillez saisir une adresse email valide'),
  message: yup.string().required('Le message est requis').min(10, 'Le message doit contenir au moins 10 caractères'),
});

const ContactForm: React.FC<ContactFormProps> = ({ idPrefix }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    message?: string;
  }>({});
  const [touched, setTouched] = useState<{
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    email?: boolean;
    message?: boolean;
  }>({});
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Fonction pour valider un champ individuel
  const validateField = async (name: string, value: string) => {
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors(prev => ({ ...prev, [name]: undefined }));
      return true;
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
      return false;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    // Valider le champ si l'utilisateur l'a déjà touché
    if (touched[name as keyof typeof touched]) {
      await validateField(name, value);
    }
  };

  const handleBlur = async (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    await validateField(name, formData[name as keyof typeof formData]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Marquer tous les champs comme touchés
    setTouched({ firstName: true, lastName: true, phone: true, email: true, message: true });

    // Valider tous les champs
    const isFirstNameValid = await validateField('firstName', formData.firstName);
    const isLastNameValid = await validateField('lastName', formData.lastName);
    const isPhoneValid = await validateField('phone', formData.phone);
    const isEmailValid = await validateField('email', formData.email);
    const isMessageValid = await validateField('message', formData.message);

    // Si des erreurs existent, arrêter ici
    if (!isFirstNameValid || !isLastNameValid || !isPhoneValid || !isEmailValid || !isMessageValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Message envoyé avec succès !');
        setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus(`Erreur: ${result.error || 'Une erreur est survenue'}`);
        setTimeout(() => setStatus(''), 5000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setStatus('Erreur de connexion au serveur');
      setTimeout(() => setStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
      className="space-y-5 sm:space-y-8 lg:space-y-10"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Prénom */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-firstName`} className="sr-only">
          Prénom
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <input
              type="text"
              name="firstName"
              id={`${idPrefix}-firstName`}
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => {
                setFocusedField(null);
                handleBlur('firstName');
              }}
              placeholder="Votre prénom"
              className={`relative w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl py-3 px-4 sm:py-4 sm:px-6 lg:py-5 lg:px-8 text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 text-base sm:text-lg ${
                errors.firstName
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-700/50 focus:border-white/50 focus:ring-white/20'
              }`}
            />
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 ${
                errors.firstName
                  ? 'bg-gradient-to-r from-red-500 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              }`}
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'firstName' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
        <AnimatePresence>
          {errors.firstName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 text-red-400 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.firstName}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nom de famille */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-lastName`} className="sr-only">
          Nom de famille
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <input
              type="text"
              name="lastName"
              id={`${idPrefix}-lastName`}
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => {
                setFocusedField(null);
                handleBlur('lastName');
              }}
              placeholder="Votre nom de famille"
              className={`relative w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl py-3 px-4 sm:py-4 sm:px-6 lg:py-5 lg:px-8 text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 text-base sm:text-lg ${
                errors.lastName
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-700/50 focus:border-white/50 focus:ring-white/20'
              }`}
            />
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 ${
                errors.lastName
                  ? 'bg-gradient-to-r from-red-500 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              }`}
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'lastName' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
        <AnimatePresence>
          {errors.lastName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 text-red-400 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.lastName}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Téléphone */}
      <motion.div variants={fieldVariants}>
        <label htmlFor={`${idPrefix}-phone`} className="sr-only">
          Téléphone
        </label>
        <CursorHover cursorStyle="text">
          <motion.div className="relative group" whileHover="hover" whileFocus="focus">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <input
              type="tel"
              name="phone"
              id={`${idPrefix}-phone`}
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => {
                setFocusedField(null);
                handleBlur('phone');
              }}
              placeholder="Votre numéro de téléphone"
              className={`relative w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl py-3 px-4 sm:py-4 sm:px-6 lg:py-5 lg:px-8 text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 text-base sm:text-lg ${
                errors.phone
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-700/50 focus:border-white/50 focus:ring-white/20'
              }`}
            />
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 ${
                errors.phone
                  ? 'bg-gradient-to-r from-red-500 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              }`}
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'phone' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
        <AnimatePresence>
          {errors.phone && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 text-red-400 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.phone}</span>
            </motion.div>
          )}
        </AnimatePresence>
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
              onBlur={() => {
                setFocusedField(null);
                handleBlur('email');
              }}
              placeholder="Votre email"
              className={`relative w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl py-3 px-4 sm:py-4 sm:px-6 lg:py-5 lg:px-8 text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 text-base sm:text-lg ${
                errors.email
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-700/50 focus:border-white/50 focus:ring-white/20'
              }`}
            />
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 ${
                errors.email
                  ? 'bg-gradient-to-r from-red-500 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              }`}
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'email' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
        <AnimatePresence>
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 text-red-400 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.email}</span>
            </motion.div>
          )}
        </AnimatePresence>
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
              onBlur={() => {
                setFocusedField(null);
                handleBlur('message');
              }}
              placeholder="Parlez-nous de votre projet..."
              className={`relative w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl py-3 px-4 sm:py-4 sm:px-6 text-white placeholder-gray-400 focus:ring-2 transition-all duration-300 text-base sm:text-lg resize-none ${
                errors.message
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-700/50 focus:border-white/50 focus:ring-white/20'
              }`}
            />
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 ${
                errors.message
                  ? 'bg-gradient-to-r from-red-500 to-transparent'
                  : 'bg-gradient-to-r from-white to-transparent'
              }`}
              initial={{ width: 0 }}
              animate={{ width: focusedField === 'message' ? '100%' : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </CursorHover>
        <AnimatePresence>
          {errors.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-center gap-2 text-red-400 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errors.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bouton et Status */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4"
        variants={fieldVariants}
      >
        <CursorHover>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative w-full sm:w-auto bg-gradient-to-r from-white to-gray-200 text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl hover:from-gray-200 hover:to-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
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
