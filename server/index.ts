import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration de dotenv pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log pour vérifier que la clé est chargée
console.log('🔑 API_KEY_RESEND chargée:', process.env.API_KEY_RESEND ? '✅ Oui' : '❌ Non');

import { sendContactEmail } from '../lib/email';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route de contact
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({
        error: 'Tous les champs sont requis',
        missing: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          phone: !phone,
          message: !message,
        },
      });
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Validation du téléphone (au moins 10 caractères)
    if (phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide' });
    }

    // Envoyer l'email via Resend
    const result = await sendContactEmail({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Email envoyé avec succès',
      });
    } else {
      console.error('Erreur Resend:', result.error);
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email",
      });
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
});

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📧 API de contact disponible sur http://localhost:${PORT}/api/contact`);
});

export default app;
