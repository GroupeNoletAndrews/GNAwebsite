import React, { useEffect, useState } from 'react';
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
    <section className="relative h-full flex items-center justify-center text-center overflow-hidden px-4">
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div
          className={`mx-auto h-auto w-full max-w-2xl mb-6 sm:mb-8 transition-all transform ease-in-out ${
            isLoaded ? 'opacity-100 scale-100 delay-200 duration-1000' : 'opacity-0 scale-95'
          }`}
        >
          <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
            <TiltedCard
              imageSrc="https://plexview.ca/assets/Nolet__andrews_blanc-CHc9YYqz.png"
              altText="Groupe Nolet & Andrews"
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
        </div>
        <h1 className="sr-only">Groupe Nolet & Andrews</h1>

        <p
          className={`mt-4 max-w-2xl mx-auto text-lg sm:text-2xl lg:text-3xl text-gray-300 px-2 leading-relaxed transition-all transform ease-in-out ${
            isLoaded ? 'opacity-100 translate-y-0 delay-500 duration-700' : 'opacity-0 translate-y-4'
          }`}
        >
          Plus de 30 ans d'expérience en consultation et gestion, mis au service des PME et grandes entreprises du
          Québec.
        </p>
        <div className="mt-8 sm:mt-14 w-full max-w-md mx-auto sm:max-w-none sm:flex sm:justify-center px-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
            <CursorHover
              as="button"
              onClick={handleContactClick}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-base sm:text-lg font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 transition-all transform ease-in-out ${
                isLoaded ? 'opacity-100 translate-y-0 delay-[1000ms] duration-700' : 'opacity-0 translate-y-4'
              }`}
            >
              Contactez-Nous
            </CursorHover>
            <CursorHover
              as="button"
              onClick={handleServicesClick}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 sm:px-8 border border-gray-700 text-base sm:text-lg font-medium rounded-md shadow-sm text-white bg-gray-900/50 hover:bg-gray-800/50 transition-all transform ease-in-out ${
                isLoaded ? 'opacity-100 translate-y-0 delay-[1200ms] duration-700' : 'opacity-0 translate-y-4'
              }`}
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
