import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { CursorHover } from './Cursor';

// En prod sur Vercel: utiliser URL relative. En dev: localhost
const API_URL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : import.meta.env.MODE === 'production'
    ? ''
    : 'http://localhost:3001';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface MessengerFormProps {
  idPrefix: string;
}

const MessengerForm: React.FC<MessengerFormProps> = ({ idPrefix }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botMessages = [
    "Salut ! 👋 Je suis l'assistant de Groupe Nolet & Andrews. Comment puis-je vous aider aujourd'hui ?",
    'Parfait ! Pour commencer, quel est votre prénom ?',
    'Merci ! Et votre nom de famille ?',
    'Excellent ! Maintenant, quel est votre numéro de téléphone ?',
    'Parfait ! Et enfin, quelle est votre adresse email ?',
    "Super ! Dernière question : parlez-nous de votre projet ou de ce qui vous amène ici aujourd'hui.",
    'Merci beaucoup ! Nous avons bien reçu toutes vos informations. Notre équipe vous contactera dans les plus brefs délais. À bientôt ! 🚀',
  ];

  const fieldKeys = ['firstName', 'lastName', 'phone', 'email', 'message'] as const;
  const fieldLabels = ['prénom', 'nom de famille', 'numéro de téléphone', 'adresse email', 'message'];

  const fieldValidators: any = {
    firstName: yup
      .string()
      .required('REQUIRED')
      .min(2, 'MIN-2')
      .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'LETTERS_ONLY'),
    lastName: yup
      .string()
      .required('REQUIRED')
      .min(2, 'MIN-2')
      .matches(/^[a-zA-ZÀ-ÿ\s-']+$/, 'LETTERS_ONLY'),
    phone: yup
      .string()
      .required('REQUIRED')
      .matches(/^[\d\s()-]+$/, 'PHONE_FORMAT')
      .min(10, 'MIN-10'),
    email: yup.string().required('REQUIRED').email('EMAIL_INVALID'),
    message: yup.string().required('REQUIRED').min(10, 'MIN-10'),
  };

  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      sender: 'bot',
      content: botMessages[0],
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShowInput(true);
      }, 1500);
    }, 2000);
  }, []);

  useEffect(() => {
    if (hasUserInteracted && (messages.length > 1 || isTyping)) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasUserInteracted]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const rect = messagesEndRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isVisible) {
        requestAnimationFrame(() => {
          const messagesContainer = messagesEndRef.current?.closest('.overflow-y-auto');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          } else {
            messagesEndRef.current?.scrollIntoView({
              behavior: 'instant',
              block: 'end',
              inline: 'nearest',
            });
          }
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setHasUserInteracted(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    if (currentStep === -1) {
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);

        setCurrentStep(0);

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          content: botMessages[1],
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        });

        setTimeout(() => {
          setInputValue('');
        }, 1000);
      }, 1500);

      return;
    }

    try {
      const field = fieldKeys[currentStep];
      const validator = fieldValidators[field];

      await validator.validate(inputValue.trim());

      setHasError(false);
      setUserData(prev => ({ ...prev, [field]: inputValue.trim() }));

      setTimeout(async () => {
        setIsTyping(false);

        if (currentStep < fieldKeys.length - 1) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);

          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            content: botMessages[nextStep + 1],
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, botMessage]);

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              scrollToBottom();
            });
          });

          setTimeout(() => {
            setInputValue('');
          }, 1000);
        } else {
          const updatedUserData = { ...userData, [field]: inputValue.trim() };

          try {
            const response = await fetch(`${API_URL}/api/contact`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedUserData),
            });

            const result = await response.json();

            if (response.ok) {
              const finalMessage: Message = {
                id: `bot-final-${Date.now()}`,
                sender: 'bot',
                content: botMessages[botMessages.length - 1],
                timestamp: new Date(),
              };

              setMessages(prev => [...prev, finalMessage]);
            } else {
              const errorMessage: Message = {
                id: `bot-error-${Date.now()}`,
                sender: 'bot',
                content: `❌ Désolé, une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer ou nous contacter directement.`,
                timestamp: new Date(),
              };

              setMessages(prev => [...prev, errorMessage]);
            }
          } catch (error) {
            console.error("Erreur lors de l'envoi:", error);
            const errorMessage: Message = {
              id: `bot-error-${Date.now()}`,
              sender: 'bot',
              content: `❌ Impossible de se connecter au serveur. Veuillez vérifier votre connexion et réessayer.`,
              timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorMessage]);
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              scrollToBottom();
            });
          });

          setTimeout(() => {
            setShowInput(false);
          }, 2000);
        }
      }, 1500);
    } catch (error: any) {
      setHasError(true);

      const stepAtError = currentStep;

      setTimeout(() => {
        setIsTyping(false);

        const fieldLabel = fieldLabels[stepAtError];
        const capitalizedField = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1);

        let customError = '';

        const currentField = fieldKeys[stepAtError];

        if (error.message === 'REQUIRED') {
          customError = `${capitalizedField} est requis`;
        } else if (error.message === 'MIN-2') {
          customError = `${capitalizedField} doit contenir au moins 2 caractères`;
        } else if (error.message === 'MIN-10') {
          if (currentField === 'phone') {
            customError = `${capitalizedField} doit contenir au moins 10 chiffres`;
          } else {
            customError = `${capitalizedField} doit contenir au moins 10 caractères`;
          }
        } else if (error.message === 'LETTERS_ONLY') {
          customError = `${capitalizedField} ne doit contenir que des lettres`;
        } else if (error.message === 'PHONE_FORMAT') {
          customError = `${capitalizedField} doit contenir uniquement des chiffres, espaces, parenthèses et tirets`;
        } else if (error.message === 'EMAIL_INVALID') {
          customError = 'Veuillez saisir une adresse email valide';
        } else {
          customError = `${capitalizedField} est invalide`;
        }

        const errorMessage: Message = {
          id: `bot-error-${Date.now()}`,
          sender: 'bot',
          content: `❌ ${customError}. Veuillez ressaisir votre ${fieldLabel}.`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        });

        setTimeout(() => {
          setInputValue('');
        }, 1000);
      }, 1500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReset = () => {
    // Réinitialiser tous les états
    setMessages([]);
    setCurrentStep(-1); // Retour au message d'accueil
    setUserData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });
    setIsTyping(false);
    setShowInput(false);
    setInputValue('');
    setHasUserInteracted(false);
    setHasError(false);

    // Reinitialiser après un court délai
    setTimeout(() => {
      const initialMessage: Message = {
        id: '1',
        sender: 'bot',
        content: botMessages[0],
        timestamp: new Date(),
      };
      setMessages([initialMessage]);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setShowInput(true);
        }, 1500);
      }, 2000);
    }, 100);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden h-[450px] sm:h-[500px] lg:h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs sm:text-sm">GN&A</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate">Groupe Nolet & Andrews</h3>
            <p className="text-gray-400 text-xs sm:text-sm">En ligne maintenant</p>
          </div>
        </div>
        {/* Bouton Recommencer */}
        <AnimatePresence>
          {hasUserInteracted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <CursorHover>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2"
                  title="Recommencer"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="hidden sm:inline">Recommencer</span>
                </motion.button>
              </CursorHover>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-700 text-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
            onAnimationComplete={() => {
              // Scroll après l'animation d'apparition de l'indicateur de frappe
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  scrollToBottom();
                });
              });
            }}
          >
            <div className="bg-gray-700 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-gray-700/50 p-3 sm:p-4"
          >
            <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-3">
              <CursorHover cursorStyle="text">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={currentStep === -1 ? 'Tapez votre message...' : `Votre ${fieldLabels[currentStep]}...`}
                  disabled={isTyping}
                  className={`flex-1 bg-gray-800/50 border border-gray-600/50 rounded-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
                    isTyping ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </CursorHover>
              <CursorHover>
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  whileHover={{ scale: isTyping ? 1 : 1.05 }}
                  whileTap={{ scale: isTyping ? 1 : 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-full transition-colors duration-300 flex-shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </motion.button>
              </CursorHover>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessengerForm;
