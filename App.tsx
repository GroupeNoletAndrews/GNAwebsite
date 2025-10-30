import Lenis from 'lenis';
import { useEffect, useRef, useState } from 'react';
import About from './components/About';
import Contact from './components/Contact';
import ContactModal from './components/ContactModal';
import { CursorProvider } from './components/Cursor';
import Header from './components/Header';
import Hero from './components/Hero';
import PourquoiNousChoisir from './components/PourquoiNousChoisir';
import Prism from './components/Prism';
import Services from './components/Services';
import Team from './components/Team';

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Désactiver Lenis sur mobile pour utiliser le scroll natif
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return;
    }

    const lenisInstance = new Lenis({
      wrapper: scrollRef.current,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer to detect active section on scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index > -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: scrollContainer, // Watch for intersections within our scroll container
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleNavigate = (index: number) => {
    const target = sectionRefs.current[index];
    if (!target) return;

    if (lenis) {
      // Utiliser Lenis sur desktop pour un scroll fluide
      lenis.scrollTo(target, { offset: 0, duration: 2 });
    } else {
      // Fallback pour mobile ou si Lenis n'est pas initialisé
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  const sectionComponents = [
    { id: 'home', Component: Hero, props: { onContactClick: handleContactClick } },
    { id: 'about', Component: About },
    { id: 'services', Component: Services },
    { id: 'team', Component: Team },
    { id: 'pourquoi-nous-choisir', Component: PourquoiNousChoisir },
    { id: 'contact', Component: Contact },
  ];

  return (
    <CursorProvider>
      <div className="fixed inset-0 -z-10 opacity-50">
        <Prism
          animationType="3drotate"
          height={3.5}
          baseWidth={5.5}
          glow={1.5}
          noise={0}
          scale={3.6}
          timeScale={0.2}
          suspendWhenOffscreen
        />
      </div>
      <div
        ref={scrollRef}
        className="bg-transparent text-gray-300 h-full w-full overflow-y-auto overflow-x-hidden"
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <Header onNavigate={handleNavigate} activeIndex={activeIndex} />

        <main>
          {sectionComponents.map(({ id, Component, props }, index) => {
            const needsLenis = ['services', 'team', 'pourquoi-nous-choisir'].includes(id);
            const additionalProps = needsLenis ? { lenis, scrollRef } : {};
            return (
              <div
                key={id}
                ref={el => {
                  sectionRefs.current[index] = el;
                }}
                id={id}
                className={index === 0 ? 'h-screen' : ''}
              >
                <Component isActive={activeIndex === index} {...props} {...additionalProps} />
              </div>
            );
          })}
        </main>

        <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
      </div>
    </CursorProvider>
  );
}
