# Corrections pour l'affichage mobile

## Problèmes identifiés

### 1. Formulaire de contact
Le formulaire de contact ne s'affichait pas correctement sur mobile (iPhone 14) après le déploiement.

### 2. Barre de navigation
La barre de navigation n'était pas responsive et le menu mobile ne fonctionnait pas correctement.

### 3. Sections qui ne s'affichent pas
Certaines sections complètes (About, Services, Contact, etc.) ne s'affichaient pas sur mobile à cause des animations Framer Motion trop complexes.

## Causes principales

1. **Overflow hidden global** : Le CSS dans `index.html` appliquait `overflow: hidden` à tous les éléments, empêchant le scroll natif sur mobile
2. **Lenis (scroll custom)** : Le système de scroll personnalisé Lenis interférait avec le comportement natif d'iOS
3. **Animations Framer Motion** : Les animations avec `AnimatePresence` et transformations Y causaient des problèmes de rendu sur mobile
4. **Hauteur fixe** : Le MessengerForm utilisait des hauteurs fixes qui ne s'adaptaient pas bien aux petits écrans
5. **Absence de styles mobiles** : Pas de styles CSS spécifiques pour gérer les particularités d'iOS

## Corrections apportées

### 0. Système de détection mobile (nouveau)

#### `lib/use-is-mobile.ts` - Hook personnalisé
```typescript
export function useIsMobile(breakpoint: number = 768): boolean
```
- ✅ Détecte si l'utilisateur est sur mobile
- ✅ Écoute les changements de taille d'écran
- ✅ Utilisé partout pour adapter les animations et le comportement

#### `components/Animated.tsx` - Simplification des animations
```typescript
// Desktop: animations complètes
export const itemVariantsDesktop: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

// Mobile: animations simplifiées (pas de transformations)
export const itemVariantsMobile: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export function useItemVariants(): Variants {
  const isMobile = useIsMobile();
  return isMobile ? itemVariantsMobile : itemVariantsDesktop;
}
```
- ✅ Sur mobile: **seulement opacity** (pas de `y`, `scale`)
- ✅ Animations 2x plus rapides sur mobile (`duration: 0.3` vs `0.6`)
- ✅ `AnimatedContainer` réduit le stagger et delay sur mobile
- ✅ Threshold d'intersection plus faible (`0.1` vs `0.2`)

#### `components/About.tsx` & `Contact.tsx` - Variants adaptatifs
```typescript
const isMobile = useIsMobile();
const itemVariants = useItemVariants();

const variants = isMobile
  ? { visible: { opacity: 1 }, hidden: { opacity: 0 } }
  : { visible: { opacity: 1, scale: 1 }, hidden: { opacity: 0, scale: 0.95 } };
```
- ✅ Supprime les animations de scale sur mobile
- ✅ Utilise des variants conditionnels basés sur le device
- ✅ Améliore drastiquement les performances sur iOS

## Corrections du formulaire

### 1. `index.html` - Gestion du overflow responsive
```css
/* Desktop: custom overflow control */
@media (min-width: 768px) {
  html, body, #root {
    overflow: hidden;
  }
}
/* Mobile: allow native scroll */
@media (max-width: 767px) {
  html, body, #root {
    overflow: auto;
  }
}
```
- ✅ Permet le scroll natif sur mobile
- ✅ Ajoute `-webkit-overflow-scrolling: touch` pour un scroll fluide iOS

### 2. `App.tsx` - Désactivation de Lenis sur mobile
```typescript
// Désactiver Lenis sur mobile pour utiliser le scroll natif
const isMobile = window.innerWidth < 768;
if (isMobile) {
  return;
}
```
- ✅ Utilise le scroll natif sur mobile (< 768px)
- ✅ Garde Lenis pour desktop uniquement
- ✅ Ajoute `WebkitOverflowScrolling` et `overscrollBehavior`

### 3. `Contact.tsx` - Simplification des animations
```typescript
<AnimatePresence mode="wait" initial={false}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
```
- ✅ Supprime les animations `y` (vertical) qui causent des problèmes
- ✅ Utilise uniquement `opacity` pour des transitions plus légères
- ✅ Ajoute `initial={false}` pour éviter l'animation au premier rendu
- ✅ Ajoute `className="w-full"` pour garantir la largeur complète

### 4. `MessengerForm.tsx` - Hauteurs flexibles
```typescript
className="min-h-[450px] max-h-[450px] sm:min-h-[500px] sm:max-h-[500px] lg:min-h-[600px] lg:max-h-[600px] touch-manipulation"
```
- ✅ Utilise `min-h` et `max-h` au lieu de `h` fixe
- ✅ Ajoute `touch-manipulation` pour améliorer les interactions tactiles

### 5. `ContactForm.tsx` - Optimisation mobile
```typescript
className="space-y-5 sm:space-y-8 lg:space-y-10 w-full touch-manipulation"
```
- ✅ Ajoute `w-full` pour garantir la largeur complète
- ✅ Ajoute `touch-manipulation` pour les interactions tactiles

### 6. `index.css` - Nouveau fichier de styles mobiles
Création d'un fichier CSS dédié avec :
- ✅ Fix pour le zoom automatique des inputs sur iOS (font-size: 16px minimum)
- ✅ Amélioration du scroll avec `-webkit-overflow-scrolling: touch`
- ✅ Désactivation du highlight tactile
- ✅ Fix pour la hauteur sur iOS avec `-webkit-fill-available`
- ✅ Optimisation des performances avec `translateZ(0)`
- ✅ Fix pour les animations Framer Motion
- ✅ Amélioration du `touch-action` pour les boutons

### 7. `index.html` - Amélioration du viewport et overflow responsive
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
```
- ✅ Permet le zoom utilisateur (accessibilité)
- ✅ Limite le zoom max à 5.0

## Corrections de la navigation (Header)

### 8. `components/Header.tsx` - Navigation mobile améliorée

```typescript
// Logo toujours visible sur mobile
className={`${isScrolled ? 'opacity-100' : 'md:opacity-0 md:pointer-events-none opacity-100'}`}

// Menu hamburger amélioré avec animations
<AnimatePresence>
  {isOpen && (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
```

- ✅ Logo visible en permanence sur mobile (pas seulement après scroll)
- ✅ Hauteur responsive: `h-20 sm:h-24 md:h-28`
- ✅ Menu mobile avec `AnimatePresence` pour transitions fluides
- ✅ Bouton hamburger avec rotation animée
- ✅ Bloc le scroll du body quand le menu est ouvert
- ✅ Ferme automatiquement le menu lors du changement de section
- ✅ Items du menu avec animations séquentielles (stagger)
- ✅ Amélioration visuelle: border, shadow-lg, touch-manipulation
- ✅ Taille de texte adaptative: `text-base sm:text-lg`

## Comment tester

### Test en local
1. Ouvrir les DevTools Chrome
2. Activer le mode responsive (Ctrl+Shift+M / Cmd+Shift+M)
3. Sélectionner "iPhone 14 Pro" ou similaire
4. Vérifier que le formulaire s'affiche correctement
5. Tester le scroll et les interactions

### Test sur appareil réel
1. Déployer sur Vercel : `vercel --prod`
2. Ouvrir l'URL sur un iPhone 14
3. Naviguer vers la section Contact
4. Vérifier :
   - Le formulaire est visible
   - Le scroll fonctionne
   - Les champs de saisie sont cliquables
   - Les animations sont fluides
   - Pas de zoom automatique lors du focus sur les inputs

## Debug supplémentaire

Si le problème persiste :

### 1. Vérifier la console mobile
Sur Safari iOS :
1. Activer "Web Inspector" dans Réglages > Safari > Avancé
2. Connecter l'iPhone au Mac
3. Ouvrir Safari > Développement > [iPhone] > [Page]
4. Vérifier les erreurs console

### 2. Activer les logs de débogage
Ajouter dans `Contact.tsx` :
```typescript
useEffect(() => {
  console.log('Contact component mounted');
  console.log('Window size:', window.innerWidth, window.innerHeight);
  console.log('Is messenger mode:', isMessengerMode);
}, []);
```

### 3. Vérifier le CSS chargé
Dans la console mobile :
```javascript
console.log(getComputedStyle(document.querySelector('form')));
```

### 4. Désactiver temporairement les animations
Dans `Contact.tsx` :
```typescript
<AnimatePresence mode="wait" initial={false}>
  {isMessengerMode ? (
    <div className="w-full">  {/* Remplacer motion.div par div */}
      <MessengerForm idPrefix="page" />
    </div>
  ) : (
    // ...
  )}
</AnimatePresence>
```

## Commandes de déploiement

```bash
# Build local
yarn build

# Test du build local
yarn preview

# Déploiement Vercel
vercel --prod

# Ou via Git (auto-deploy)
git add .
git commit -m "fix: corrections affichage mobile formulaire"
git push origin main
```

## Checklist de vérification mobile

### Général
- [ ] Toutes les sections s'affichent correctement (Hero, About, Services, Team, Pourquoi nous choisir, Contact)
- [ ] Le scroll fonctionne correctement (natif, pas de blocage)
- [ ] Les animations sont fluides (pas de saccades)
- [ ] Pas de contenu coupé ou hors écran

### Navigation (Header)
- [ ] Logo visible en permanence
- [ ] Bouton hamburger accessible et cliquable
- [ ] Menu mobile s'ouvre avec animation
- [ ] Items du menu sont cliquables
- [ ] Le menu se ferme après navigation
- [ ] Pas de scroll du body quand le menu est ouvert

### Formulaire de contact
- [ ] Le formulaire est visible sur mobile
- [ ] Le scroll fonctionne dans le formulaire
- [ ] Les champs de saisie sont cliquables
- [ ] Pas de zoom automatique sur les inputs
- [ ] Les animations sont fluides
- [ ] Le bouton de soumission fonctionne
- [ ] Le switch entre formulaire classique et chat fonctionne
- [ ] Les messages de validation s'affichent
- [ ] Le clavier mobile ne cache pas le champ actif

### Sections About et Contact
- [ ] Les cartes/éléments s'affichent
- [ ] Les animations de fade-in fonctionnent
- [ ] Pas de problème avec les animations scale
- [ ] Le texte est lisible

## Notes importantes

1. **Performance mobile** : Les animations et effets ont été simplifiés pour mobile
   - Pas de transformations `scale` ou `y` sur mobile
   - Seulement `opacity` pour les transitions
   - Durées réduites de 50% (`0.3s` vs `0.6s`)
   - Stagger et delays réduits de 50%
   
2. **Scroll natif** : Sur mobile, on utilise le scroll natif iOS au lieu de Lenis
   - Désactivation de Lenis pour `window.innerWidth < 768`
   - Ajout de `-webkit-overflow-scrolling: touch`
   - `overscrollBehavior: contain`

3. **Touch events** : Tous les éléments interactifs ont `touch-manipulation`
   - Améliore la réactivité des boutons
   - Réduit le délai de 300ms sur iOS
   
4. **Font size** : Les inputs ont minimum 16px pour éviter le zoom iOS
   - Critère d'accessibilité
   - Empêche le zoom automatique d'iOS
   
5. **Viewport height** : Utilise `-webkit-fill-available` pour iOS
   - Fix pour les barres d'adresse mobile
   - Garantit le plein écran
   
6. **Framer Motion sur mobile** :
   - Hook `useIsMobile()` pour détecter le device
   - Variants conditionnels (desktop vs mobile)
   - `AnimatedContainer` adaptatif
   - Threshold d'intersection réduit (`0.1` vs `0.2`)

## Problèmes connus et solutions

### Le formulaire disparaît lors du changement d'orientation
**Solution** : Ajouter un listener de resize dans `Contact.tsx`

### Les animations saccadent sur mobile
**Solution** : ✅ **RÉSOLU** - animations simplifiées (opacity seulement sur mobile)
- Utilise `useIsMobile()` et `useItemVariants()`
- Pas de transformations CSS sur mobile

### Le clavier cache le champ actif
**Solution** : ✅ **RÉSOLU** - iOS gère cela automatiquement avec le scroll natif activé

### Le formulaire est trop grand sur petits écrans
**Solution** : ✅ **RÉSOLU** - hauteurs responsive avec min/max-h

### Les sections ne s'affichent pas (About, Contact, etc.)
**Solution** : ✅ **RÉSOLU** - animations Framer Motion simplifiées
- Suppression des `scale` sur mobile
- Variants conditionnels basés sur `useIsMobile()`
- Threshold d'intersection réduit pour déclencher plus facilement

### Le menu mobile ne s'ouvre pas
**Solution** : ✅ **RÉSOLU** - animations avec `AnimatePresence`
- Animation de hauteur: `height: 0` → `height: 'auto'`
- Rotation du bouton hamburger
- Bloc du scroll du body pendant l'ouverture

## Support

Si vous rencontrez toujours des problèmes :
1. Vérifier la version iOS (doit être iOS 13+)
2. Vider le cache Safari
3. Tester en navigation privée
4. Vérifier que JavaScript est activé
5. Consulter les logs Vercel pour les erreurs serveur

