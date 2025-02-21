import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id, role } = req.query;

  if (req.method === 'GET') {
    // Recupera i feedback in base al ruolo
    let query = 'SELECT * FROM feedback WHERE ID_Veterinario = 25';
    let queryParams = [];
    if (role === 'utente') {
      const cookies = parse(req.headers.cookie || '');
      const token = cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Non autenticato' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const idUtente = decoded.id;
      query += ' AND ID_Utente = ?';
      queryParams.push(idUtente);
    }
    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('Errore nel recupero dei feedback: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Crea un nuovo feedback
    const { testo, valutazione } = req.body;
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUtente = decoded.id;

    db.query(
      'INSERT INTO feedback (Testo, Valutazione, ID_Utente, ID_Veterinario) VALUES (?, ?, ?, ?)',
      [testo, valutazione, idUtente, 25],
      (err, results) => {
        if (err) {
          console.error('Errore nella creazione del feedback: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(201).json({ ID_Feedback: results.insertId, Testo: testo, Valutazione: valutazione, ID_Utente: idUtente, ID_Veterinario: 25});
      }
    );
  } else if (req.method === 'DELETE') {
    // Elimina un feedback
    db.query(
      'DELETE FROM feedback WHERE ID_Feedback = ?',
      [id],
      (err, results) => {
        if (err) {
          console.error('Errore nell\'eliminazione del feedback: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(200).json({ message: 'Feedback eliminato con successo' });
      }
    );
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}