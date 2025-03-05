import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'GET') {

    // Ottieni i cookie dalla richiesta
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }

    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ID_Utente = decoded.id; // Ottieni l'ID dell'utente dal token decodificato

    // Query per unire appuntamento, orario e utente
    const query = `
      SELECT 
        a.ID_Appuntamento,
        a.Descrizione,
        a.data,
        o.Orario_Inizio,
        o.Orario_Fine,
        u.ID_Utente,
        u.Nome,
        u.Cognome
      FROM appuntamento a
      INNER JOIN orario o ON a.ID_Orario = o.ID_Orario
      INNER JOIN utente u ON a.ID_Utente = u.ID_Utente
      WHERE a.ID_Veterinario = '${ID_Utente}'
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Errore nel recupero degli eventi:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }

      // Inviamo i dati grezzi al frontend senza mappare
      return res.status(200).json(results);
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}