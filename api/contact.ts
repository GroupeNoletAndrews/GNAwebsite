import { sendContactEmail } from '../lib/email';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { firstName, lastName, email, phone, message } = req.body;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

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
      return res.status(500).json({
        error: "Erreur lors de l'envoi de l'email",
        details: result.error,
      });
    }
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
}
