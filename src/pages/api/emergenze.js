import db from '../../../lib/db';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { id, role } = req.query;

  if (req.method === 'GET') {
    // Recupera le emergenze in base al ruolo
    let query = `
      SELECT e.*, u.Nome, u.Cognome 
      FROM emergenza e 
      JOIN utente u ON e.ID_Utente = u.ID_Utente 
      WHERE e.ID_Veterinario = 25
    `;
    if (role === 'veterinario') {
      query += ` ORDER BY FIELD(e.Stato, 'Attiva', 'Risolta'), e.Data DESC`;
    } else {
      query += ` ORDER BY e.Data DESC`;
    }
    db.query(query, (err, results) => {
      if (err) {
        console.error('Errore nel recupero delle emergenze: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      return res.status(200).json(results);
    });
  } else if (req.method === 'POST') {
    // Crea una nuova emergenza
    const { descrizione } = req.body;
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUtente = decoded.id;

    // Controlla se l'utente ha già un'emergenza attiva
    db.query(
      'SELECT * FROM emergenza WHERE ID_Utente = ? AND Stato = "Attiva"',
      [idUtente],
      (err, results) => {
        if (err) {
          console.error('Errore nel controllo delle emergenze attive: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        if (results.length > 0) {
          return res.status(400).json({ error: 'Hai già un\'emergenza attiva.' });
        }

        db.query(
          'INSERT INTO emergenza (Descrizione, Stato, ID_Utente, ID_Veterinario) VALUES (?, ?, ?, ?)',
          [descrizione, 'Attiva', idUtente, 25],
          (err, results) => {
            if (err) {
              console.error('Errore nella creazione dell\'emergenza: ', err);
              return res.status(500).json({ error: 'Errore interno del server' });
            }
            return res.status(201).json({ ID_Emergenza: results.insertId, Descrizione: descrizione, Stato: 'Attiva', ID_Utente: idUtente, ID_Veterinario: 25 });
          }
        );
      }
    );
  } else if (req.method === 'PUT') {
    // Aggiorna lo stato di un'emergenza
    const { stato } = req.body;
    db.query(
      'UPDATE emergenza SET Stato = ? WHERE ID_Emergenza = ?',
      [stato, id],
      (err) => {
        if (err) {
          console.error('Errore nell\'aggiornamento dell\'emergenza: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(200).json({ ID_Emergenza: id, Stato: stato });
      }
    );
  } else if (req.method === 'DELETE') {
    // Elimina un'emergenza
    db.query(
      'DELETE FROM emergenza WHERE ID_Emergenza = ?',
      [id],
      (err) => {
        if (err) {
          console.error('Errore nell\'eliminazione dell\'emergenza: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(200).json({ message: 'Emergenza eliminata con successo' });
      }
    );
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}