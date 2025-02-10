import db from '../../../lib/db';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Verifica se l'email esiste nel database
      const query = 'SELECT * FROM veterinario WHERE email = ?';
      db.query(query, [email], async (err, results) => {
        if (err) {
          console.error('Errore nella ricerca dei dati: ', err);
          return res.status(500).json({ error: "Errore interno del server" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Email o password non validi" });
        }

        const veterinario = results[0];

        // Confronta la password inserita con quella cifrata nel database
        const isMatch = await bcrypt.compare(password, veterinario.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Email o password non validi" });
        }

        // Imposta il cookie di sessione
        const cookie = serialize('session', JSON.stringify(veterinario), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          expires: 0,
          sameSite: 'strict',
          path: '/'
        });

        res.setHeader('Set-Cookie', cookie);

        // Login riuscito, restituisci tutti i dati del veterinario
        return res.status(200).json(veterinario);
      });
    } catch (error) {
      console.error('Errore nel login:', error);
      return res.status(500).json({ error: "Errore interno del server" });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}