import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Query per unire appuntamento, orario e utente
    const query = `
      SELECT 
        a.ID_Appuntamento,
        a.Motivo,
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
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Errore nel recupero degli eventi:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }

      // Mappiamo i risultati in modo da formare gli eventi per FullCalendar.
      const events = results.map(event => {
        // Converti il campo 'data' in formato ISO (YYYY-MM-DD)
        const isoDate = new Date(event.data).toISOString().split('T')[0]; // Estrae "YYYY-MM-DD"

        return {
          id: event.ID_Appuntamento,
          title: event.Motivo,
          start: isoDate + 'T' + event.Orario_Inizio, // es. "2025-02-12T08:00:00"
          end: isoDate + 'T' + event.Orario_Fine,     // es. "2025-02-12T08:30:00"
          description: event.Descrizione,
          nome: event.Nome,
          cognome: event.Cognome
        };
      });

      return res.status(200).json(events);
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}