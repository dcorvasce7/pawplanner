import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    let query = 'SELECT * FROM veterinario';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Errore nel recupero dei dati: ', err);
        return res.status(500).json({ error: 'Errore interno del server' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Veterinario non trovato' });
      }
      return res.status(200).json(id ? results[0] : results);
    });
  } else if (req.method === 'PUT') {
    // Aggiorna i dati del veterinario
    const { Nome, Cognome, email, telefono, ragione_sociale, partita_iva, codice_fiscale, indirizzo, cap, citta, specializzazione, num_iscrizione_albo } = req.body;
    db.query(
      'UPDATE veterinario SET Nome = ?, Cognome = ?, email = ?, telefono = ?, ragione_sociale = ?, partita_iva = ?, codice_fiscale = ?, indirizzo = ?, cap = ?, citta = ?, specializzazione = ?, num_iscrizione_albo = ? WHERE ID_Veterinario = ?',
      [ Nome, Cognome, email, telefono, ragione_sociale, partita_iva, codice_fiscale, indirizzo, cap, citta, specializzazione, num_iscrizione_albo, id],
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