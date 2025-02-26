import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { ID_Orario, Descrizione, ID_Veterinario, data, Motivo } = req.body;

    // Ottieni i cookie dalla richiesta
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }

    // Verifica il token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const ID_Utente = decoded.id; // Ottieni l'ID dell'utente dal token decodificato

    const query = `
      INSERT INTO appuntamento (ID_Orario, Descrizione, ID_Utente, ID_Veterinario, data, Motivo)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [ID_Orario, Descrizione, ID_Utente, ID_Veterinario, data, Motivo], (err, results) => {
      if (err) {
        console.error("Errore nella creazione dell'appuntamento:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }

      return res.status(200).json({ message: "Appuntamento creato con successo" });
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}