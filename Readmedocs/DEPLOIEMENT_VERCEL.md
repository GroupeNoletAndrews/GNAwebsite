# 🚀 Guide de Déploiement sur Vercel

## 📋 Prérequis

1. Compte Vercel (gratuit) : https://vercel.com
2. Clé d'API Resend
3. Domaine vérifié sur Resend

---

## 🔧 Étape 1 : Préparer le projet

### 1.1 Mettre à jour les URLs API dans le code

Le frontend doit pointer vers l'API Vercel. Comme l'API sera sur le même domaine, on peut utiliser des URLs relatives.

**Dans `.env.production` :**

```env
# Variables serveur
API_KEY_RESEND=re_VotreCleProduction
CONTACT_EMAIL=groupenoletandrews@gmail.com

# Variables client - URL vide = utilise le même domaine
VITE_API_URL=
```

### 1.2 Modifier le fallback dans les composants

Si `VITE_API_URL` est vide, utiliser une URL relative :

**Dans `components/ContactForm.tsx` et `components/MessengerForm.tsx` :**

Remplacer :

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

Par :

```typescript
const API_URL = import.meta.env.VITE_API_URL || '';
```

---

## 🌐 Étape 2 : Déployer sur Vercel

### Option A : Via le Dashboard Vercel (Recommandé)

1. **Connectez-vous à Vercel** : https://vercel.com/dashboard

2. **Importer votre projet** :

   - Cliquez sur "Add New Project"
   - Sélectionnez votre repository GitHub
   - Cliquez sur "Import"

3. **Configurer le projet** :

   - **Framework Preset** : Vite
   - **Root Directory** : `./` (racine)
   - **Build Command** : `yarn build`
   - **Output Directory** : `dist`
   - **Install Command** : `yarn install`

4. **Ajouter les variables d'environnement** :

   Allez dans "Environment Variables" et ajoutez :

   ```
   API_KEY_RESEND = re_VotreCleProduction
   CONTACT_EMAIL = groupenoletandrews@gmail.com
   VITE_API_URL = (laisser vide)
   ```

5. **Déployer** :
   - Cliquez sur "Deploy"
   - Attendez que le build se termine
   - Votre site sera disponible sur `https://votre-projet.vercel.app`

### Option B : Via la CLI Vercel

```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Suivre les instructions
# Framework: Vite
# Build Command: yarn build
# Output Directory: dist

# Ajouter les variables d'environnement
vercel env add API_KEY_RESEND
vercel env add CONTACT_EMAIL
vercel env add VITE_API_URL

# Redéployer avec les variables
vercel --prod
```

---

## 📧 Étape 3 : Configuration Resend

1. **Vérifier votre domaine** sur Resend
2. **Configurer les DNS** selon les instructions Resend
3. **Tester l'envoi d'email** depuis votre site déployé

---

## ✅ Vérification

### Tester l'API

```bash
curl -X POST https://votre-projet.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "5145551234",
    "message": "Test message"
  }'
```

### Tester le formulaire

1. Aller sur votre site : `https://votre-projet.vercel.app`
2. Remplir le formulaire de contact
3. Vérifier que l'email arrive bien

---

## 🔄 Déploiements futurs

Vercel se met à jour automatiquement à chaque push sur `main` ou `staging` !

### Branches

- **Production** : Branche `main` → `https://votre-projet.vercel.app`
- **Preview** : Autres branches → `https://branch-name-votre-projet.vercel.app`

---

## 🐛 Dépannage

### L'API ne fonctionne pas

1. Vérifier les logs : `vercel logs`
2. Vérifier que les variables d'environnement sont bien définies
3. Vérifier que la clé Resend est valide

### Le formulaire ne soumet pas

1. Ouvrir la console navigateur (F12)
2. Vérifier l'URL de l'API appelée
3. Vérifier les erreurs CORS

### Les emails n'arrivent pas

1. Vérifier les logs Resend : https://resend.com/logs
2. Vérifier que le domaine est bien vérifié
3. Vérifier les DNS du domaine

---

## 🌟 Domaine personnalisé

Pour utiliser `noletandrews.ca` au lieu de `vercel.app` :

1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine : `noletandrews.ca`
3. Configurer les DNS selon les instructions Vercel
4. Attendre la propagation DNS (quelques minutes à 48h)

---

## 📊 Monitoring

Vercel fournit automatiquement :

- ✅ Analytics
- ✅ Logs en temps réel
- ✅ Métriques de performance
- ✅ Alertes d'erreurs

Accessible via : https://vercel.com/dashboard

---

## 💰 Coûts

- **Plan Hobby (Gratuit)** :

  - Bande passante : 100 GB/mois
  - Invocations serverless : 100 GB-Hrs
  - Largement suffisant pour un site de PME

- **Plan Pro** (20$/mois) :
  - Si vous dépassez les limites gratuites
  - Support prioritaire
