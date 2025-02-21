import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Prendi il token dal cookie
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Non autenticato' });
      }

      // Decodifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Restituisci l'utente (o altre informazioni, come ruolo, se necessario)
      return res.status(200).json({ user: { id: decoded.id, email: decoded.email, role: decoded.role } });
    } catch (error) {
      return res.status(401).json({ error: 'Token non valido' });
    }
  } else {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }
}
