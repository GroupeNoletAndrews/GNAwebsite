import type { NavLink, Service, SocialLink, TeamMember } from './types';

// Icons
const OptimizationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ConsultingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const DataAnalysisIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const AutomationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TrainingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const CustomDevIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z" />
  </svg>
);

// Data
export const NAV_LINKS: NavLink[] = [
  { name: 'À Propos', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Notre Équipe', href: '#team' },
  { name: 'Pourquoi Nous ?', href: '#pourquoi-nous-choisir' },
  { name: 'Contact', href: '#contact' },
];

export const SERVICES: Service[] = [
  {
    icon: <ConsultingIcon />,
    title: "Conseils d'affaires & consultation",
    description:
      'Analyse de marché, planification stratégique et optimisation des processus pour propulser la croissance de votre entreprise.',
    imageUrl:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <DataAnalysisIcon />,
    title: 'Analyse de Données & Intelligence d’Affaires',
    description:
      "Tirez parti de vos données pour prendre de meilleures décisions grâce à des tableaux de bord interactifs et des outils d'intelligence d'affaires sur mesure.",
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <TrainingIcon />,
    title: 'Formation & Accompagnement',
    description:
      'Renforcez les compétences de vos équipes avec des formations pratiques et un accompagnement personnalisé pour une autonomie et une efficacité accrues.',
    imageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <OptimizationIcon />,
    title: 'Optimisation Web',
    description:
      "Amélioration de la vitesse, de l'expérience utilisateur (UX) et du référencement (SEO). Nous modernisons vos sites pour qu'ils soient plus rapides, sécurisés et adaptés, avec un design moderne pour une présence crédible.",
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <AutomationIcon />,
    title: 'Automatisation',
    description:
      'Augmentez votre productivité en automatisant les processus répétitifs. Gagnez du temps, réduisez les erreurs et concentrez-vous sur votre croissance.',
    imageUrl:
      'https://images.unsplash.com/photo-1674059048324-356d7871217c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    icon: <CustomDevIcon />,
    title: 'Développement de Solutions Digitales sur Mesure',
    description:
      "Obtenez des solutions numériques entièrement personnalisées, conçues pour vos besoins uniques et pour stimuler l'innovation et la croissance.",
    imageUrl:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Édouard Nolet',
    role: 'Co-Fondateur',
    description:
      "Passionné par l'intersection de la technologie et de la stratégie d'affaires, Édouard guide nos clients à travers le paysage numérique complexe pour découvrir des opportunités de croissance inexploitées. Son expertise réside dans la transformation des défis en résultats tangibles.",
    imageUrl: 'https://picsum.photos/seed/edouard/800/800',
    align: 'left',
  },
  {
    name: 'Philippe Andrews',
    role: 'Co-Fondateur',
    description:
      "Avec un œil pour l'optimisation et une approche axée sur les données, Philippe s'assure que chaque solution que nous créons est non seulement innovante, mais aussi performante. Il se consacre à l'amélioration continue pour garantir un impact maximal à nos partenaires.",
    imageUrl: '/images/team/cf_pa.jpg',
    align: 'right',
  },
  {
    name: 'Karine Boucher',
    role: 'Consultante Sénior',
    description:
      'Avec plus de vingt ans d’expérience dans le domaine, Karine apporte une expertise approfondie en stratégie et en accompagnement d’entreprise. Son parcours riche et diversifié fait d’elle une référence pour conseiller, orienter et soutenir nos clients dans leurs défis de croissance et de transformation numérique.',
    imageUrl: 'https://picsum.photos/seed/karine/800/800',
    align: 'left',
  },
  {
    name: 'Jean-Chérif Ayanou',
    role: 'Développeur',
    description:
      'Architecte de nos solutions numériques, Jean-Chérif allie créativité technique et rigueur pour construire des plateformes web robustes, rapides et intuitives. Il est le moteur derrière la qualité et la fiabilité de nos développements techniques.',
    imageUrl: '/images/team/dev_jca.jpg',
    align: 'right',
  },
  
];

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', icon: <InstagramIcon />, href: 'https://www.instagram.com/groupenoletandrews/' },
];
