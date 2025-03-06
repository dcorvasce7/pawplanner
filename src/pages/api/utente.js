import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Recupera i dati dell'utente
    db.query('SELECT * FROM utente WHERE ID_Utente = ?', [id], (err, results) => {
      if (err) {
        console.error('Errore nel recupero dei dati: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      return res.status(200).json(id ? results[0] : results);
    });
  } else if (req.method === 'PUT') {
    // Aggiorna i dati dell'utente
    const { Nome, Cognome, email, telefono} = req.body;
    db.query(
      'UPDATE utente SET Nome = ?, Cognome = ?, Email = ?, Numero_di_telefono = ? WHERE ID_Utente = ?',
      [ Nome, Cognome, email, telefono, id],
      (err, results) => {
        if (err) {
          console.error('Errore nell\'aggiornamento dei dati: ', err);
          return res.status(500).json({ error: 'Errore interno del server' });
        }
        return res.status(200).json({ message: 'Dati aggiornati con successo' });
      }
    );
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}