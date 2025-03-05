import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {

    const today = new Date().toISOString().split('T')[0]; // Formatta in 'YYYY-MM-DD'

    // Query per ottenere le fasce orarie
    const queryOrari = `
    SELECT 
    o.ID_Orario,
    o.Orario_Inizio,
    o.Orario_Fine,
    o.Giorno,
    o.ID_Veterinario,
    v.Nome,
    v.Cognome
    FROM orario o
    JOIN veterinario v ON o.ID_Veterinario = v.ID_Veterinario;
    `;

    // Query per ottenere gli appuntamenti
    const queryAppuntamenti = `
      SELECT 
        a.ID_Appuntamento,
        a.ID_Orario,
        a.Descrizione,
        a.ID_Utente,
        a.ID_Veterinario,
        a.data,
        v.Nome,
        v.Cognome
      FROM appuntamento a
      JOIN veterinario v ON a.ID_Veterinario = v.ID_Veterinario
      WHERE a.data >= '${today}';
    `;

    // Eseguiamo entrambe le query in parallelo
    Promise.all([
      new Promise((resolve, reject) => {
        db.query(queryOrari, (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(queryAppuntamenti, (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results);
        });
      })
    ])
    .then(([orari, appuntamenti]) => {
      console.log('Dati completi orari:', JSON.stringify(orari, null, 2));
      console.log('Dati completi appuntamenti:', JSON.stringify(appuntamenti, null, 2));
      
      // Inviamo i dati grezzi al frontend
      return res.status(200).json({ orari, appuntamenti });

    })
    .catch(err => {
      console.error('Errore durante il recupero dei dati:', err);
      return res.status(500).json({ error: 'Errore interno del server' });
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}