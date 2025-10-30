# 🔧 Configuration des Environnements

Ce projet utilise deux environnements distincts : **développement (local)** et **production**.

## 📁 Fichiers de configuration

### 1. Créer les fichiers .env

Vous devez créer **deux fichiers** `.env` à la racine du projet :

#### `.env.development` (pour local)

```env
# Environnement de DÉVELOPPEMENT (local)

# ===== VARIABLES SERVEUR =====
API_KEY_RESEND=re_VotreCleDev
CONTACT_EMAIL=votre-email@gmail.com
PORT=3001

# ===== VARIABLES CLIENT (Vite) =====
VITE_API_URL=http://localhost:3001
```

#### `.env.production` (pour prod)

```env
# Environnement de PRODUCTION

# ===== VARIABLES SERVEUR =====
API_KEY_RESEND=re_VotreCleProduction
CONTACT_EMAIL=votre-email@gmail.com
PORT=3001

# ===== VARIABLES CLIENT (Vite) =====
VITE_API_URL=https://api.noletandrews.ca
```

> 💡 **Astuce** : Vous pouvez copier les templates fournis :
>
> - `env.development.template` → `.env.development`
> - `env.production.template` → `.env.production`

---

## 🚀 Scripts disponibles

### Développement LOCAL (avec .env.development)

```bash
yarn dev:all:local
```

- Lance Vite en mode développement
- Lance le serveur API en mode développement
- Utilise `http://localhost:3001` comme URL d'API

### Développement PRODUCTION (avec .env.production)

```bash
yarn dev:all
```

- Lance Vite en mode production (mais en local)
- Lance le serveur API en mode production
- Utilise l'URL d'API de production (ex: `https://api.noletandrews.ca`)
- **Utile pour tester avant de déployer**

### Lancer uniquement le frontend

```bash
# Mode local
yarn dev

# Mode production
yarn dev:prod
```

### Lancer uniquement le backend

```bash
# Mode local
yarn dev:server

# Mode production
yarn dev:server:prod
```

---

## 🔑 Variables d'environnement

### Variables SERVEUR (Node.js)

- `API_KEY_RESEND` : Clé d'API Resend
- `CONTACT_EMAIL` : Email qui reçoit les messages
- `PORT` : Port du serveur (3001 par défaut)

### Variables CLIENT (Vite)

- `VITE_API_URL` : URL de l'API (doit commencer par `VITE_`)

> ⚠️ **Important** : Les variables côté client **DOIVENT** commencer par `VITE_` pour être accessibles dans le navigateur.

---

## 📝 Comment ça marche ?

### Vite (Frontend)

- `--mode development` → charge `.env.development`
- `--mode production` → charge `.env.production`

### Node.js (Backend)

- `NODE_ENV=development` → charge `.env.development`
- `NODE_ENV=production` → charge `.env.production`

---

## 🎯 Cas d'usage

### Je développe localement

```bash
yarn dev:all:local
```

✅ Utilise localhost pour l'API
✅ Utilise les clés de dev

### Je teste avant de déployer en prod

```bash
yarn dev:all
```

✅ Utilise l'URL de prod pour l'API
✅ Utilise les clés de prod
✅ Permet de détecter les problèmes avant déploiement

### Je build pour la production

```bash
yarn build
yarn build:server
```

✅ Utilise automatiquement `.env.production`

---

## 🔒 Sécurité

Les fichiers `.env.development` et `.env.production` sont **ignorés par Git** (voir `.gitignore`).

**Ne jamais committer** :

- `.env`
- `.env.development`
- `.env.production`
- Vos clés d'API

---

## ⚠️ Troubleshooting

### Le serveur ne charge pas les bonnes variables

Vérifiez que le fichier `.env.development` ou `.env.production` existe bien.

### Les variables VITE ne sont pas chargées

Les variables côté client doivent **obligatoirement** commencer par `VITE_`.

### Windows : NODE_ENV ne fonctionne pas

Le package `cross-env` est installé pour résoudre ce problème. Les scripts utilisent `cross-env` automatiquement.
