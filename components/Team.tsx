import type Lenis from 'lenis';
import React, { useRef } from 'react';
import { TEAM_MEMBERS } from '../constants';
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

  // Premium mobile layout
  const mobileLayout = (
    <div className="w-full py-16 px-4 bg-gradient-to-b from-transparent via-gray-950/30 to-transparent">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Notre Équipe</h2>
        <p className="max-w-xl mx-auto mt-3 text-lg text-gray-400">
          Les experts passionnés qui propulsent votre succès.
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        {TEAM_MEMBERS.map((member, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-950/90 border border-gray-800/50"
            style={{
              boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Subtle gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-purple-500/[0.02]"></div>

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>

            <div className="relative p-6">
              {/* Premium avatar centré */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Accent dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-4 ring-gray-900"></div>
                </div>
              </div>

              {/* Content avec meilleur espacement */}
              <div className="text-center space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{member.name}</h3>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {member.role}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-500">GNA</span>
                  </div>
                </div>
                <p className="text-[15px] text-gray-400 leading-relaxed px-2">{member.description}</p>
              </div>
            </div>

            {/* Bottom subtle glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
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
