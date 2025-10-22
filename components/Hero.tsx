
import React, { useState, useEffect } from 'react';
import { CursorHover } from './Cursor';
import TiltedCard from './TiltedCard';

interface HeroProps {
  onContactClick: () => void;
  isActive?: boolean;
}

const Hero: React.FC<HeroProps> = ({ onContactClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('hasAnimated');
    if (hasAnimated) {
      setIsLoaded(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
      sessionStorage.setItem('hasAnimated', 'true');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onContactClick();
  };
  
  const handleServicesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // This assumes services is the 2nd section (index 2)
    // A more robust solution might use a context or a more complex prop drilling
    // For now, this is a simple solution.
    const header = document.querySelector('header');
    if (header) {
      const servicesLink = Array.from(header.querySelectorAll('a, button')).find(el => el.textContent === 'Services');
      if (servicesLink) (servicesLink as HTMLElement).click();
    }
  };


  return (
    <section className="relative h-full flex items-center justify-center text-center overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`mx-auto h-auto w-full max-w-2xl mb-8 transition-all transform ease-in-out ${isLoaded ? 'opacity-100 scale-100 delay-200 duration-1000' : 'opacity-0 scale-95'}`}>
          <TiltedCard
              imageSrc="https://plexview.ca/assets/Nolet__andrews_blanc-CHc9YYqz.png"
              altText="Groupe Nolet & Andrews"
              containerWidth="100%"
              containerHeight="300px"
              imageWidth="100%"
              imageHeight="300px"
              scaleOnHover={1.05}
              rotateAmplitude={8}
              showMobileWarning={false}
              showTooltip={false}
          />
        </div>
        <h1 className="sr-only">Groupe Nolet & Andrews</h1>
        
        <p className={`mt-4 max-w-2xl mx-auto text-3xl text-gray-300 transition-all transform ease-in-out ${isLoaded ? 'opacity-100 translate-y-0 delay-500 duration-700' : 'opacity-0 translate-y-4'}`}>
          Plus de 30 ans d’expérience en consultation et gestion, mis au service des PME et grandes entreprises du Québec.
        </p>
        <div className="mt-14 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <CursorHover
              as="button"
              onClick={handleContactClick}
              className={`flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 sm:px-8 transition-all transform ease-in-out ${isLoaded ? 'opacity-100 translate-y-0 delay-[1000ms] duration-700' : 'opacity-0 translate-y-4'}`}
            >
              Contactez-nous
            </CursorHover>
            <CursorHover
              as="button"
              onClick={handleServicesClick}
              className={`flex items-center justify-center px-4 py-3 border border-gray-700 text-base font-medium rounded-md shadow-sm text-white bg-gray-900/50 hover:bg-gray-800/50 sm:px-8 transition-all transform ease-in-out ${isLoaded ? 'opacity-100 translate-y-0 delay-[1200ms] duration-700' : 'opacity-0 translate-y-4'}`}
            >
              Nos Services
            </CursorHover>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
