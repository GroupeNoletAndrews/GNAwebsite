import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
import { AnimatedContainer, itemVariants } from './Animated';
import ContactForm from './ContactForm';
import { CursorHover } from './Cursor';
import Footer from './Footer';
import MessengerForm from './MessengerForm';

interface ContactProps {
  isActive?: boolean;
}

const Contact: React.FC<ContactProps> = ({ isActive }) => {
  const [isMessengerMode, setIsMessengerMode] = useState(true);
  const variants = {
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.3, when: 'beforeChildren' } },
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
  };

  return (
    <>
      <section id="contact" className="w-full bg-gray-950/70 backdrop-blur-sm py-16 sm:py-24 lg:py-32">
        <motion.div className="w-full" variants={variants} initial="hidden" animate={isActive ? 'visible' : 'hidden'}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedContainer className="text-center" stagger={0.1}>
              <motion.h2
                variants={itemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
              >
                Contactez-nous
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-400 px-2"
              >
                Prêt à démarrer un projet ou simplement envie de discuter ? Nous sommes là pour vous.
              </motion.p>
            </AnimatedContainer>
            <AnimatedContainer className="mt-12 sm:mt-16 flex justify-center" stagger={0.2}>
              <motion.div
                variants={itemVariants}
                className="bg-gray-900/50 border border-gray-800 p-6 sm:p-8 lg:p-12 rounded-xl w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                  {/* Formulaire */}
                  <div className="flex flex-col">
                    {/* Switch Toggle */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-full p-1 inline-flex w-full max-w-sm sm:w-auto">
                        <CursorHover>
                          <motion.button
                            onClick={() => setIsMessengerMode(false)}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                              !isMessengerMode ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Formulaire classique
                          </motion.button>
                        </CursorHover>
                        <CursorHover>
                          <motion.button
                            onClick={() => setIsMessengerMode(true)}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                              isMessengerMode ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Chat interactif
                          </motion.button>
                        </CursorHover>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-10">Envoyer un message</h3>

                    {/* Formulaire conditionnel */}
                    <AnimatePresence mode="wait" initial={false}>
                      {isMessengerMode ? (
                        <motion.div
                          key="messenger"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                        >
                          <MessengerForm idPrefix="page" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="classic"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                        >
                          <ContactForm idPrefix="page" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-6 sm:space-y-10 mt-8 lg:mt-0">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-10">Nos coordonnées</h3>
                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Email</h4>
                        <CursorHover
                          as="a"
                          href="mailto:info@noletandrews.ca"
                          className="text-base sm:text-lg text-gray-400 hover:text-white transition inline-block break-all"
                        >
                          info@noletandrews.ca
                        </CursorHover>
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Téléphone</h4>
                        <CursorHover
                          as="a"
                          href="tel:5819868494"
                          className="text-base sm:text-lg text-gray-400 hover:text-white transition inline-block"
                        >
                          +1 (581) 986-8494
                        </CursorHover>
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Suivez-nous</h4>
                        <div className="flex space-x-4 sm:space-x-6">
                          {SOCIAL_LINKS.map(link => (
                            <CursorHover
                              as="a"
                              key={link.name}
                              href={link.href}
                              className="text-gray-400 hover:text-white transition transform hover:scale-110"
                            >
                              <span className="sr-only">{link.name}</span>
                              {link.icon}
                            </CursorHover>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedContainer>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
