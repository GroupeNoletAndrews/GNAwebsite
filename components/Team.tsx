import { motion } from 'framer-motion';
import type Lenis from 'lenis';
import React, { useRef } from 'react';
import { TEAM_MEMBERS } from '../constants';
import { AnimatedContainer, itemVariants } from './Animated';
import { AnimatedTitle } from './AnimatedTitle';
import TiltedCard from './TiltedCard';

interface TeamProps {
  isActive?: boolean;
  lenis: Lenis | null;
}

const Team: React.FC<TeamProps> = ({ isActive, lenis }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsColumnRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);

  // Original static layout for mobile
  const mobileLayout = (
    <motion.div
      className="w-full py-16 px-12 max-w-[1800px] mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Notre Équipe
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 max-w-3xl mx-auto text-xl text-gray-400">
            Les experts passionnés qui propulsent votre succès.
          </motion.p>
        </div>
        <AnimatedContainer className="space-y-20" stagger={0.2}>
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-16 ${
                member.align === 'right' ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="md:w-1/2 lg:w-5/12 flex-shrink-0 aspect-square">
                <TiltedCard
                  imageSrc={member.imageUrl}
                  altText={member.name}
                  containerWidth="100%"
                  containerHeight="100%"
                  imageWidth="100%"
                  imageHeight="100%"
                  scaleOnHover={1.05}
                  rotateAmplitude={8}
                  showMobileWarning={false}
                  showTooltip={false}
                />
              </div>
              <div className="md:w-1/2 lg:w-7/12 text-center md:text-left">
                <h3 className="text-3xl sm:text-4xl font-bold text-white">{member.name}</h3>
                <p className="text-xl text-indigo-400 mt-2 mb-4 font-semibold">{member.role}</p>
                <p className="text-lg text-gray-400 leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatedContainer>
      </div>
    </motion.div>
  );

  return (
    <section id="team" className="w-full">
      <div className="hidden md:block">
        <div className="max-w-[1800px] mx-auto">
          <div ref={sectionRef} className="relative">
            <div className="sticky top-0 h-screen w-full grid grid-cols-1 md:grid-cols-5 overflow-hidden px-8 gap-x-8">
              <AnimatedTitle
                lenis={lenis}
                isActive={isActive}
                title="Notre Équipe"
                description="Les experts passionnés qui propulsent votre succès."
                sectionRef={sectionRef}
                cardsListRef={cardsListRef}
                cardsColumnRef={cardsColumnRef}
              />

              <div
                ref={cardsColumnRef}
                className="hidden md:flex md:col-span-3 items-start justify-start relative pt-[35vh] pb-[35vh] opacity-0 max-h-screen overflow-hidden px-12"
                style={{ willChange: 'opacity' }}
              >
                <div ref={cardsListRef} className="w-full" style={{ willChange: 'transform' }}>
                  <div className="space-y-16">
                    {TEAM_MEMBERS.map((member, index) => (
                      <div
                        key={index}
                        className={`flex flex-col md:flex-row items-center gap-12 md:gap-8 ${
                          member.align === 'right' ? 'md:flex-row-reverse' : ''
                        }`}
                      >
                        <div className="md:w-5/12 flex-shrink-0 aspect-square">
                          <TiltedCard
                            imageSrc={member.imageUrl}
                            altText={member.name}
                            containerWidth="100%"
                            containerHeight="100%"
                            imageWidth="100%"
                            imageHeight="100%"
                            scaleOnHover={1.05}
                            rotateAmplitude={8}
                            showMobileWarning={false}
                            showTooltip={false}
                          />
                        </div>
                        <div className="md:w-7/12 text-center md:text-left">
                          <h3 className="text-3xl font-bold text-white">{member.name}</h3>
                          <p className="text-xl text-indigo-400 mt-2 mb-4 font-semibold">{member.role}</p>
                          <p className="text-lg text-gray-400 leading-relaxed">{member.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">{mobileLayout}</div>
    </section>
  );
};

export default Team;
