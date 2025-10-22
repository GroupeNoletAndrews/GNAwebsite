import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { CursorHover } from './Cursor';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
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

  useEffect(() => {
    // Message initial du bot
    const initialMessage: Message = {
      id: '1',
      sender: 'bot',
      content: botMessages[0],
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    // Démarrer la conversation après 1 seconde
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShowInput(true);
      }, 1500);
    }, 2000);
  }, []);

  useEffect(() => {
    // Ne faire le scroll automatique que si l'utilisateur a déjà interagi avec le chat
    // Cela évite le scroll automatique au chargement de la page
    if (hasUserInteracted && (messages.length > 1 || isTyping)) {
      scrollToBottom();
    }
  }, [messages, isTyping, hasUserInteracted]);

  const scrollToBottom = () => {
    // Utiliser scrollIntoView seulement si l'élément est visible dans le viewport
    if (messagesEndRef.current) {
      const rect = messagesEndRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      // Ne faire le scroll que si l'utilisateur est déjà dans la section contact
      if (isVisible) {
        // Utiliser requestAnimationFrame pour une synchronisation parfaite avec le rendu
        requestAnimationFrame(() => {
          // Trouver le conteneur de messages parent
          const messagesContainer = messagesEndRef.current?.closest('.overflow-y-auto');
          if (messagesContainer) {
            // Scroll instantané vers le bas du conteneur de messages
            // Cela évite les conflits avec Lenis et les animations
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          } else {
            // Fallback avec scrollIntoView si le conteneur n'est pas trouvé
            messagesEndRef.current?.scrollIntoView({
              behavior: 'instant', // Changé de 'smooth' à 'instant' pour éviter les conflits
              block: 'end',
              inline: 'nearest',
            });
          }
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Marquer que l'utilisateur a interagi avec le chat
    setHasUserInteracted(true);

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    // Ne pas faire disparaître l'input immédiatement, seulement désactiver temporairement
    setIsTyping(true);

    // Sauvegarder la réponse
    if (currentStep < fieldKeys.length) {
      const field = fieldKeys[currentStep];
      setUserData(prev => ({ ...prev, [field]: inputValue.trim() }));
    }

    // Scroll immédiatement après l'ajout du message utilisateur
    // Utiliser requestAnimationFrame pour une synchronisation parfaite
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    // Réponse du bot après 1.5 secondes
    setTimeout(() => {
      setIsTyping(false);

      if (currentStep < fieldKeys.length - 1) {
        // Prochaine question
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          content: botMessages[nextStep],
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        // Scroll après l'ajout du message du bot
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        });

        setTimeout(() => {
          // Garder l'input visible et juste vider le champ
          setInputValue('');
        }, 1000);
      } else {
        // Message final
        const finalMessage: Message = {
          id: `bot-final-${Date.now()}`,
          sender: 'bot',
          content: botMessages[botMessages.length - 1],
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, finalMessage]);

        // Scroll après le message final
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        });

        // Faire disparaître l'input seulement après le message final
        setTimeout(() => {
          setShowInput(false);
        }, 2000);

        // Ici vous pouvez envoyer les données au serveur
        console.log('Données complètes:', userData);
      }
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700/50 p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">GN&A</span>
        </div>
        <div>
          <h3 className="text-white font-semibold">Groupe Nolet & Andrews</h3>
          <p className="text-gray-400 text-sm">En ligne maintenant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-700 text-gray-100 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
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
            className="border-t border-gray-700/50 p-4"
          >
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <CursorHover cursorStyle="text">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={`Votre ${fieldLabels[currentStep]}...`}
                  disabled={isTyping}
                  className={`flex-1 bg-gray-800/50 border border-gray-600/50 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 ${
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
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
