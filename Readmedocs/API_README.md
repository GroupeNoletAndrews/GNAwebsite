# 🚀 Guide d'installation et utilisation de l'API

## 📦 Installation des dépendances

```bash
yarn install
# ou
npm install
```

## 🔧 Configuration

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet :

```env
# Resend API Key (obtenez-la sur https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Port du serveur API (optionnel, par défaut 3001)
PORT=3001
```

### 2. Obtenir votre clé API Resend

1. Créez un compte sur https://resend.com
2. Allez dans **API Keys**
3. Créez une nouvelle clé
4. Copiez-la dans votre `.env`

## 🏃 Démarrage

### Développement

#### Option 1 : Démarrer tout ensemble (recommandé)

```bash
yarn dev:all
# ou
npm run dev:all
```

Cela démarre :

- Le frontend Vite sur `http://localhost:3000`
- Le serveur API sur `http://localhost:3001`

#### Option 2 : Démarrer séparément

Terminal 1 - Frontend :

```bash
yarn dev
```

Terminal 2 - API :

```bash
yarn dev:server
```

### Production

1. Build le frontend :

```bash
yarn build
```

2. Build le serveur :

```bash
yarn build:server
```

3. Démarrer le serveur :

```bash
yarn start:server
```

## 🔌 Endpoints API

### POST `/api/contact`

Envoie un email avec les informations du formulaire.

**Corps de la requête :**

```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "+1 (581) 123-4567",
  "message": "Bonjour, j'aimerais en savoir plus sur vos services..."
}
```

**Réponse succès (200) :**

```json
{
  "success": true,
  "message": "Email envoyé avec succès"
}
```

**Réponse erreur (400) :**

```json
{
  "error": "Tous les champs sont requis",
  "missing": {
    "firstName": false,
    "lastName": false,
    "email": true,
    "phone": false,
    "message": false
  }
}
```

### GET `/api/health`

Vérifie si l'API fonctionne.

**Réponse :**

```json
{
  "status": "ok",
  "timestamp": "2025-10-27T12:34:56.789Z"
}
```

## 📝 Utilisation dans les composants

### Exemple avec ContactForm

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setStatus('Message envoyé avec succès !');
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
    } else {
      setStatus(`Erreur : ${data.error}`);
    }
  } catch (error) {
    setStatus('Erreur réseau. Veuillez réessayer.');
    console.error('Erreur:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

## 🧪 Test de l'API

### Avec curl

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "5811234567",
    "message": "Test message"
  }'
```

### Avec Postman ou Insomnia

1. Créer une requête POST
2. URL : `http://localhost:3001/api/contact`
3. Headers : `Content-Type: application/json`
4. Body (raw JSON) : voir exemple ci-dessus

## 📊 Structure des fichiers

```
├── server/
│   ├── index.ts          # Serveur Express principal
│   └── dev.ts            # Script de développement avec hot-reload
├── lib/
│   └── email.ts          # Fonction d'envoi d'email avec Resend
├── templates/
│   └── contact-email.html # Template HTML de l'email
├── .env                  # Variables d'environnement (à créer)
├── package.json          # Scripts et dépendances
└── vite.config.ts        # Configuration du proxy Vite
```

## ⚠️ Important

- **Ne committez jamais** le fichier `.env`
- Ajoutez `.env` à votre `.gitignore`
- En production, configurez `RESEND_API_KEY` dans les variables d'environnement de votre hébergeur
- Le domaine `from` dans `lib/email.ts` doit être vérifié sur Resend

## 🌐 Déploiement

### Option 1 : Vercel (recommandé pour Vite)

1. Installer Vercel CLI :

```bash
npm i -g vercel
```

2. Déployer :

```bash
vercel
```

3. Configurer les variables d'environnement dans le dashboard Vercel

### Option 2 : Heroku, Railway, Render, etc.

Assurez-vous de :

1. Configurer la variable `RESEND_API_KEY`
2. Exécuter `yarn build` et `yarn build:server`
3. Démarrer avec `yarn start:server`

## 🆘 Dépannage

### Le serveur ne démarre pas

- Vérifiez que le port 3001 n'est pas utilisé
- Vérifiez que `RESEND_API_KEY` est bien définie dans `.env`

### Les emails ne sont pas envoyés

- Vérifiez votre clé API Resend
- Vérifiez que votre domaine est vérifié sur Resend
- Consultez les logs du serveur pour plus de détails

### Le proxy ne fonctionne pas

- Assurez-vous que le serveur API tourne sur le port 3001
- Redémarrez Vite après avoir modifié `vite.config.ts`

## 📚 Documentation

- [Resend Documentation](https://resend.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

