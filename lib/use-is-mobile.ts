import { useEffect, useState } from 'react';

/**
 * Hook pour détecter si l'utilisateur est sur un appareil mobile
 * @param breakpoint Le point de rupture en pixels (par défaut 768px)
 * @returns true si l'écran est plus petit que le breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Vérifier initialement
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Vérifier au chargement
    checkIsMobile();

    // Écouter les changements de taille
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
