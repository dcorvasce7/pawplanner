import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Rimuovi il cookie di sessione
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Imposta il cookie come scaduto
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Logout riuscito' });
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}