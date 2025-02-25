import db from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Query per unire appuntamento e orario
    const query = `
      SELECT 
        o.ID_Orario,
        o.Orario_Inizio,
        o.Orario_Fine,
        o.Stato,
        o.Giorno,
        a.ID_Appuntamento,
        a.Motivo,
        a.Descrizione,
        a.ID_Utente,
        a.ID_Veterinario,
        a.data
      FROM orario o
      LEFT JOIN appuntamento a ON o.ID_Orario = a.ID_Orario
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Errore nel recupero degli eventi:", err);
        return res.status(500).json({ error: "Errore interno del server" });
      }

      // Log dei risultati originali
      console.log("Risultati originali:", results);

      // Mappiamo i risultati in modo da formare gli eventi per FullCalendar.
      const events = results.map(event => {
        // Controlla se i valori di data sono validi
        const data = event.data ? new Date(event.data) : null;
        const giorno = event.Giorno ? event.Giorno : null;

        // Converti il campo 'data' in formato ISO (YYYY-MM-DD)
        const isoDate = data && !isNaN(data) ? data.toISOString().split('T')[0] : null;

        // Aggiusta il fuso orario per evitare problemi di data
        const startDate = isoDate ? new Date(isoDate + 'T' + event.Orario_Inizio) : null;
        const endDate = isoDate ? new Date(isoDate + 'T' + event.Orario_Fine) : null;

        // Se è un appuntamento
        if (event.ID_Appuntamento) {
          return {
            id: event.ID_Appuntamento,
            title: 'Occupato',
            start: startDate ? startDate.toISOString() : null,
            end: endDate ? endDate.toISOString() : null,
            description: event.Descrizione,
            stato: event.Stato
          };
        } else {
          // Se è un orario prenotabile
          return {
            id: event.ID_Orario,
            title: 'Orario Prenotabile',
            daysOfWeek: [convertDayToNumber(giorno)], // Converti il giorno in numero
            startTime: event.Orario_Inizio,
            endTime: event.Orario_Fine,
            description: 'Orario disponibile per prenotazione',
            stato: event.Stato
          };
        }
      });

      // Log degli eventi mappati
      console.log("Eventi mappati:", events);

      return res.status(200).json(events);
    });
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}

// Funzione per convertire il giorno della settimana in numero
function convertDayToNumber(day) {
  switch (day) {
    case 'Dom':
      return 0;
    case 'Lun':
      return 1;
    case 'Mar':
      return 2;
    case 'Mer':
      return 3;
    case 'Gio':
      return 4;
    case 'Ven':
      return 5;
    case 'Sab':
      return 6;
    default:
      return null;
  }
}