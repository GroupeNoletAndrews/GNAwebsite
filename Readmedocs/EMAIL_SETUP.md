# Configuration de l'envoi d'emails avec Resend

## 📋 Prérequis

1. Un compte Resend : https://resend.com
2. Un domaine vérifié sur Resend (ou utiliser leur domaine de test)
3. Node.js installé

## 🚀 Installation

### 1. Installer Resend

```bash
npm install resend
# ou
yarn add resend
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=info@noletandrews.ca
```

Pour obtenir votre clé API :

- Allez sur https://resend.com/api-keys
- Créez une nouvelle clé API
- Copiez-la dans votre fichier `.env`

### 3. Vérifier votre domaine

Dans le dashboard Resend :

1. Allez dans "Domains"
2. Ajoutez votre domaine (ex: noletandrews.ca)
3. Ajoutez les enregistrements DNS fournis par Resend
4. Attendez la vérification (quelques minutes à quelques heures)

## 📁 Structure des fichiers créés

```
├── templates/
│   └── contact-email.html          # Template HTML de l'email
├── lib/
│   └── email.ts                    # Fonction d'envoi d'email
└── api/
    └── contact.ts                  # Route API pour le formulaire
```

## 🔧 Utilisation

### Dans vos composants de formulaire

Modifiez `ContactForm.tsx` et `MessengerForm.tsx` pour appeler l'API :

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

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
      // Réinitialiser le formulaire
      setFormData({ firstName: '', lastName: '', phone: '', email: '', message: '' });
    } else {
      setStatus("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error('Erreur:', data.error);
    }
  } catch (error) {
    setStatus("Erreur lors de l'envoi. Veuillez réessayer.");
    console.error('Erreur:', error);
  }
};
```

## 🎨 Personnalisation du template

Le template HTML se trouve dans `templates/contact-email.html` et `lib/email.ts`.

Pour le modifier :

1. Éditez le HTML dans `lib/email.ts` (ligne 14+)
2. Les variables disponibles :
   - `${firstName}` - Prénom
   - `${lastName}` - Nom de famille
   - `${email}` - Email du contact
   - `${phone}` - Téléphone
   - `${message}` - Message

## 🧪 Test en développement

Resend offre un domaine de test : `onboarding@resend.dev`

Vous pouvez l'utiliser pour tester sans vérifier votre domaine :

```typescript
from: 'onboarding@resend.dev',
```

## ⚠️ Important

- Ne commitez JAMAIS votre fichier `.env` avec la clé API
- Ajoutez `.env` à votre `.gitignore`
- En production, utilisez les variables d'environnement de votre hébergeur
- Vérifiez votre domaine avant d'envoyer des emails en production

## 📊 Limites Resend (plan gratuit)

- 100 emails/jour
- 3 000 emails/mois
- 1 domaine vérifié

Pour plus : https://resend.com/pricing

## 🆘 Support

En cas de problème :

- Documentation Resend : https://resend.com/docs
- Statut Resend : https://resend.com/status
- Support : support@resend.com
