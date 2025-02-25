import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id, role } = req.query;

  if (req.method === 'GET') {
    // Recupera i feedback in base al ruolo
    let query = 'SELECT f.*, u.Nome, u.Cognome FROM feedback f JOIN utente u ON f.ID_Utente = u.ID_Utente WHERE f.ID_Veterinario = 25';
    db.query(query, (err, results) => {
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
    const idUtente = decoded.id; //id_utente

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
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUtente = decoded.id;

    // Controlla se il feedback appartiene all'utente corrente
    db.query('SELECT * FROM feedback WHERE ID_Feedback = ? AND ID_Utente = ?', [id, idUtente], (err, results) => {
      if (err) {
        console.error('Errore nel controllo del feedback: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      if (results.length === 0) {
        return res.status(403).json({ error: 'Non autorizzato' });
      }

      // Elimina il feedback
      db.query('DELETE FROM feedback WHERE ID_Feedback = ?', [id], (err, results) => {
        if (err) {
          console.error('Errore nell\'eliminazione del feedback: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(200).json({ message: 'Feedback eliminato con successo', userId: idUtente });
      });
    });
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}