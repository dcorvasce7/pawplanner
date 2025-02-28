import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { selectedDate } = req.query;
    console.log('Data selezionata:', selectedDate);

    if (!selectedDate) {
      return res.status(400).json({ error: "selectedDate è richiesto" });
    }

    // Query per ottenere le fasce orarie
    const queryOrari = `
      SELECT 
        ID_Orario,
        Orario_Inizio,
        Orario_Fine,
        Stato,
        Giorno,
        ID_Veterinario
      FROM orario
    `;

    // Query per ottenere gli appuntamenti
    const queryAppuntamenti = `
      SELECT 
        ID_Appuntamento,
        ID_Orario,
        Motivo,
        Descrizione,
        ID_Utente,
        ID_Veterinario,
        data
      FROM appuntamento
    `;

    // Eseguiamo entrambe le query in parallelo
    Promise.all([
      new Promise((resolve, reject) => {
        db.query(queryOrari, (err, results) => {
          if (err) {
            return reject(err);
          }
          console.log('Risultati orari dal DB:', results);
          resolve(results);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(queryAppuntamenti, (err, results) => {
          if (err) {
            return reject(err);
          }
          console.log('Risultati appuntamenti dal DB:', results);
          resolve(results);
        });
      })
    ])
    .then(([orari, appuntamenti]) => {
      console.log('Dati completi orari:', JSON.stringify(orari, null, 2));
      console.log('Dati completi appuntamenti:', JSON.stringify(appuntamenti, null, 2));
      
      // Inviamo i dati grezzi al frontend
      return res.status(200).json({
        orari,
        appuntamenti
      });
    })
    .catch(err => {
      console.error('Errore durante il recupero dei dati:', err);
      return res.status(500).json({ error: 'Errore interno del server' });
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}