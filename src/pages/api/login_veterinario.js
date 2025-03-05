import db from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // Importa la libreria per il JWT
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
        console.log('Risultato della query:', veterinario);

        // Confronta la password inserita con quella cifrata nel database
        const isMatch = await bcrypt.compare(password, veterinario.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Email o password non validi" });
        }

        // Crea un JWT firmato
        const token = jwt.sign(
          { id: veterinario.ID_Veterinario, email: veterinario.email, role: 'veterinario' },  // Dati utili nel token
          process.env.JWT_SECRET,  // Una chiave segreta definita nel .env
        );

        // Imposta il cookie con il token JWT
        const cookie = serialize('token', token, {
          httpOnly: true,  // Non accessibile via JavaScript (sicurezza)
          secure: process.env.NODE_ENV === 'production',  // Solo in https in produzione
          expires: new Date(Date.now() + 3600000),  // Scadenza di 1 ora
          sameSite: 'strict',  // Politica di sicurezza per i cookie
          path: '/'  // Valido per tutte le rotte
        });

        res.setHeader('Set-Cookie', cookie);

        // Login riuscito, restituisci i dati del veterinario
        return res.status(200).json({ message: 'Login riuscito', veterinario });
      });
    } catch (error) {
      console.error('Errore nel login:', error);
      return res.status(500).json({ error: "Errore interno del server" });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
