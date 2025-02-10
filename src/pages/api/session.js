import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cookies = parse(req.headers.cookie || '');
    const session = cookies.session ? JSON.parse(cookies.session) : null;

    // Log per vedere cosa c'è nei cookies
    console.log('Cookies:', cookies);

    if (session) {
      // Log per vedere cosa c'è nella sessione
      console.log('Session data:', session);
      
      return res.status(200).json({ user: session });
    } else {
      console.log('Sessione non trovata');
      return res.status(401).json({ error: 'Non autenticato' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
