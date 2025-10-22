import type Lenis from 'lenis';
import React, { useRef } from 'react';
import { SERVICES } from '../constants';
import type { Service } from '../types';
import { AnimatedTitle } from './AnimatedTitle';
import { WobbleCard } from './ui/WobbleCard';
import { ExpandableCard } from './ui/expandable-card';

const expandedServiceContent: Record<string, React.ReactNode> = {
  'Optimisation Web': (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        L’optimisation et la modernisation de votre présence web sont des piliers essentiels pour assurer la
        performance, la crédibilité et la compétitivité de votre entreprise en ligne. Notre approche combine analyse
        technique, design, expérience utilisateur (UX) et référencement naturel (SEO) afin de maximiser vos résultats
        numériques.
      </p>
      <h4>Design actuel et performance</h4>
      <p>
        Un site au visuel soigné et contemporain reflète l’image de votre entreprise et inspire confiance. Nous
        repensons l’interface pour qu’elle soit attrayante, claire et alignée avec votre identité de marque, tout en
        garantissant une vitesse de chargement optimale pour une meilleure conversion.
      </p>
      <h4>Expérience utilisateur (UX/UI) et compatibilité mobile</h4>
      <p>
        Nous repensons la navigation et la structure de vos pages pour offrir une expérience simple, fluide et
        intuitive. Votre site sera parfaitement responsive et accessible sur tous les appareils, du téléphone à
        l'ordinateur.
      </p>
      <h4>Référencement (SEO) et sécurité</h4>
      <p>
        Nous optimisons la structure, le code et le contenu de vos pages afin d’être mieux compris par les moteurs de
        recherche. De plus, nous mettons à jour l’infrastructure technique et les protocoles de sécurité pour offrir une
        expérience fiable à vos utilisateurs.
      </p>
      <p>
        Transformer votre site en un outil de performance moderne qui attire, engage et convertit : voilà notre
        objectif.
      </p>
    </div>
  ),
  "Conseils d'affaires & consultation": (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        Les conseils d’affaires et la consultation stratégique sont au cœur de la croissance durable d’une entreprise.
        Notre rôle est de vous accompagner dans vos décisions clés en vous offrant une vision claire, des outils
        concrets et un plan d’action aligné sur vos objectifs.
      </p>
      <h4>Analyse de marché et diagnostic</h4>
      <p>
        Nous étudions votre environnement d’affaires, vos concurrents et vos opportunités afin de définir les leviers de
        croissance les plus pertinents.
      </p>
      <h4>Planification stratégique</h4>
      <p>
        Nous vous aidons à bâtir une feuille de route claire, avec des étapes mesurables, afin que vos initiatives
        numériques et organisationnelles soutiennent vos objectifs d’affaires.
      </p>
      <h4>Optimisation des processus</h4>
      <p>
        En repensant vos méthodes de travail et vos outils, nous améliorons l’efficacité et la rentabilité de votre
        entreprise tout en réduisant les frictions opérationnelles.
      </p>
      <p>
        La consultation n’est pas seulement un accompagnement : c’est un partenariat qui vous permet de prendre de
        meilleures décisions et de transformer vos ambitions en résultats tangibles.
      </p>
    </div>
  ),
  'Cybersécurité et conformité': (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        La cybersécurité et la conformité réglementaire sont aujourd’hui des priorités incontournables pour les
        entreprises. Notre mission est de protéger vos données, vos systèmes et la confiance de vos clients grâce à des
        pratiques rigoureuses et des solutions adaptées.
      </p>
      <h4>Audits de sécurité</h4>
      <p>
        Nous réalisons une évaluation complète de vos infrastructures numériques afin d’identifier les vulnérabilités et
        de proposer des solutions concrètes.
      </p>
      <h4>Mise en place de protocoles robustes</h4>
      <p>
        Nous définissons et appliquons des mesures de protection adaptées, incluant le chiffrement des données, la
        gestion des accès et les sauvegardes sécurisées.
      </p>
      <h4>Conformité réglementaire</h4>
      <p>
        Nous vous guidons dans l’application des obligations légales, comme la Loi 25 au Québec ou le RGPD en Europe,
        afin d’assurer la conformité de vos pratiques numériques.
      </p>
      <p>
        Assurer la cybersécurité et la conformité, c’est non seulement protéger vos actifs numériques, mais aussi
        préserver la réputation et la crédibilité de votre entreprise.
      </p>
    </div>
  ),
  'Analyse de Données & Intelligence d’Affaires': (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        L’analyse de données et l’intelligence d’affaires permettent aux entreprises de transformer l’information brute
        en leviers stratégiques. Notre objectif est de vous aider à mieux comprendre vos activités et à orienter vos
        décisions grâce à des solutions claires, visuelles et adaptées à votre réalité.
      </p>
      <h4>Évaluation de vos données</h4>
      <p>
        Nous étudions, structurons et organisons vos données afin de révéler des tendances et des indicateurs pertinents
        pour votre entreprise.
      </p>
      <h4>Tableaux de bord interactifs</h4>
      <p>
        Nous développons des outils visuels et dynamiques qui permettent de suivre vos performances en temps réel et de
        simplifier la lecture de l’information clé.
      </p>
      <h4>Intelligence d’affaires sur mesure</h4>
      <p>
        Nous concevons des solutions adaptées à vos besoins afin que chaque décision s’appuie sur des données fiables et
        exploitables.
      </p>
      <p>
        Avec l’analyse de données et l’intelligence d’affaires, vos choix ne reposent plus sur l’intuition seule : ils
        sont guidés par des faits mesurables et des insights stratégiques.
      </p>
    </div>
  ),
  Automatisation: (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        L’automatisation est un levier puissant pour accroître l’efficacité et libérer du temps précieux au sein des
        entreprises. Nous vous accompagnons dans l’intégration de solutions numériques qui simplifient vos processus,
        réduisent les erreurs et augmentent la productivité de vos équipes.
      </p>
      <h4>Automatisation des processus répétitifs</h4>
      <p>
        Nous identifions les tâches à faible valeur ajoutée et mettons en place des solutions pour les exécuter
        automatiquement.
      </p>
      <h4>Intégration d’outils collaboratifs</h4>
      <p>
        Nous déployons des plateformes modernes (CRM, outils de gestion, solutions collaboratives) pour centraliser
        l’information et améliorer la communication interne.
      </p>
      <h4>Optimisation des flux de travail</h4>
      <p>
        Nous analysons vos méthodes actuelles afin de concevoir des workflows plus fluides, plus rapides et mieux
        adaptés à vos objectifs d’affaires.
      </p>
      <p>
        Automatiser et optimiser vos processus, c’est donner à vos équipes plus de temps pour se concentrer sur ce qui
        compte vraiment : l’innovation, la croissance et la satisfaction de vos clients.
      </p>
    </div>
  ),
  'Formation & Accompagnement': (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        La réussite d’une entreprise repose autant sur les technologies que sur la force de ses équipes. Chez Groupe
        Nolet & Andrews, nous offrons des programmes de formation et un accompagnement adaptés qui renforcent les
        compétences de vos employés et dirigeants. Qu’il s’agisse de gestion, d’opérations ou d’outils numériques, nous
        sommes là pour vous guider.
      </p>
      <h4>Formations spécialisées</h4>
      <p>
        Des contenus adaptés à votre secteur et à vos besoins réels, pour maximiser l’impact et la rétention des
        apprentissages.
      </p>
      <h4>Ateliers pratiques</h4>
      <p>
        Nous privilégions des Des sessions interactives qui privilégient l’action et permettent aux participants
        d’appliquer immédiatement leurs nouvelles connaissances.
      </p>
      <h4>Accompagnement continu</h4>
      <p>
        Nous restons disponibles pour donner un soutien durable, au-delà des formations, pour assurer l’autonomie, la
        confiance et la performance de vos équipes.
      </p>
      <p>
        Former et accompagner vos équipes, c’est leur donner les outils humains et numériques pour s’adapter, évoluer et
        transformer la technologie en véritable moteur de performance.
      </p>
    </div>
  ),
  'Développement de Solutions Digitales sur Mesure': (
    <div className="prose prose-invert prose-xl max-w-none text-gray-300 prose-headings:text-white prose-headings:font-semibold">
      <p>
        Chaque entreprise est unique, et ses besoins technologiques le sont tout autant. Nous concevons des solutions
        numériques personnalisées qui s’intègrent parfaitement à votre réalité et soutiennent vos objectifs d’affaires.
      </p>
      <h4>Outils de gestion adaptés</h4>
      <p>
        Nous développons des applications internes ou des plateformes spécialisées qui répondent à vos processus
        spécifiques et améliorent votre efficacité.
      </p>
      <h4>Solutions évolutives</h4>
      <p>
        Nos développements sont pensés pour s’adapter à la croissance de votre entreprise et aux nouvelles exigences de
        votre marché.
      </p>
      <h4>Intégration fluide</h4>
      <p>
        Nous veillons à ce que chaque solution déployée s’harmonise avec vos systèmes existants, garantissant une
        transition simple et une adoption rapide par vos équipes.
      </p>
      <p>
        Développer des solutions digitales sur mesure, c’est transformer vos défis opérationnels en opportunités
        d’innovation et de performance durable.
      </p>
    </div>
  ),
};

const getExpandedContent = (card: Service) => {
  const content = expandedServiceContent[card.title] || <p className="text-xl text-gray-400">Contenu à venir...</p>;
  return (
    <div className="flex flex-col items-start space-y-6">
      <div className="text-white">{card.icon}</div>
      <div>
        <h3 className="text-4xl font-bold text-white mb-8">{card.title}</h3>
        {content}
      </div>
    </div>
  );
};

// FIX: Define ServicesProps interface to fix TypeScript error.
interface ServicesProps {
  lenis: Lenis | null;
  isActive?: boolean;
}

const Services: React.FC<ServicesProps> = ({ lenis, isActive }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsColumnRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="w-full">
      <div ref={sectionRef} className="relative max-w-[1800px] mx-auto">
        <div className="sticky top-0 h-screen w-full grid grid-cols-1 md:grid-cols-5 overflow-hidden px-8 gap-x-8">
          <AnimatedTitle
            lenis={lenis}
            isActive={isActive}
            title="Nos Piliers d'Expertise"
            description="Des solutions complètes et un accompagnement sur mesure, conçus pour s’adapter à votre réalité et propulser votre entreprise au-delà de ses objectifs."
            sectionRef={sectionRef}
            cardsListRef={cardsListRef}
            cardsColumnRef={cardsColumnRef}
          />

          {/* Right column for cards */}
          <div
            ref={cardsColumnRef}
            className="hidden md:flex md:col-span-3 items-start justify-start relative pt-[30vh] pb-[30vh] opacity-0 max-h-screen overflow-hidden px-12"
            style={{ willChange: 'opacity' }}
          >
            <div ref={cardsListRef} className="w-full" style={{ willChange: 'transform' }}>
              <div className="space-y-8">
                {SERVICES.map(card => {
                  const cardContent = (
                    <div className="p-8 flex flex-col items-start space-y-6">
                      <div className="text-white">{card.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                        <p className="text-xl text-gray-400 mt-3">{card.description}</p>
                      </div>
                    </div>
                  );
                  const expandedContent = getExpandedContent(card);
                  const layoutId = `service-card-${card.title.replace(/\s+/g, '-')}`;

                  return (
                    <ExpandableCard key={card.title} layoutId={layoutId} expandedContent={expandedContent}>
                      <WobbleCard containerClassName="bg-gray-900/50 border border-gray-800">{cardContent}</WobbleCard>
                    </ExpandableCard>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile/Tablet view: Simple grid layout */}
      <div className="md:hidden bg-gray-950/50 py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Nos Piliers d'Expertise</h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-400">
            Des solutions complètes pour transformer votre présence en ligne et accélérer votre croissance.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 sm:items-start">
          {SERVICES.map(card => {
            const cardContent = (
              <div className="p-8 flex flex-col">
                <div className="text-white mb-6">{card.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                <p className="text-lg text-gray-400">{card.description}</p>
              </div>
            );
            const expandedContent = getExpandedContent(card);
            const layoutId = `service-card-mobile-${card.title.replace(/\s+/g, '-')}`;

            return (
              <ExpandableCard key={card.title} layoutId={layoutId} expandedContent={expandedContent}>
                <WobbleCard containerClassName="bg-gray-900/70 border border-gray-800">{cardContent}</WobbleCard>
              </ExpandableCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
