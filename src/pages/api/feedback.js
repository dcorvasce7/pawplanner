import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Estraiamo subito l'ID utente dai cookie per averlo disponibile per tutti i metodi
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  let idUtente;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      idUtente = decoded.id;
    } catch (error) {
      return res.status(401).json({ error: 'Token non valido' });
    }
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    // Recupera i feedback
    let query = 'SELECT f.*, u.Nome, u.Cognome, v.Nome AS NomeVet, v.Cognome AS CognomeVet FROM feedback f JOIN utente u ON f.ID_Utente = u.ID_Utente JOIN veterinario v ON f.ID_Veterinario = v.ID_Veterinario ORDER BY data DESC';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Errore nel recupero dei feedback: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Crea un nuovo feedback
    const { testo, valutazione, idVeterinario } = req.body;

    let query = 'INSERT INTO feedback (Testo, Valutazione, ID_Utente, ID_Veterinario) VALUES (?, ?, ?, ?)';
    db.query(
      query, [testo, valutazione, idUtente, idVeterinario],
      (err, results) => {
        if (err) {
          console.error('Errore nella creazione del feedback: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(201).json({ ID_Feedback: results.insertId, Testo: testo, Valutazione: valutazione, ID_Utente: idUtente, ID_Veterinario: idVeterinario});
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