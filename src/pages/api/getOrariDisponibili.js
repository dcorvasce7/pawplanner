import db from '../../../lib/db';

// Funzione helper per generare tutte le date tra due date (inclusi)
function getDatesBetween(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Mappa il giorno restituito da getDay() all'enum della tabella Orari
const dayEnumMapping = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mer',
  4: 'Gio',
  5: 'Ven',
  6: 'Sab'
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { start, end, id_veterinario } = req.query;
    if (!start || !end || !id_veterinario) {
      return res.status(400).json({ error: 'I parametri start, end e id_veterinario sono obbligatori' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log("Ricevuto id_veterinario:", id_veterinario);
    console.log("Data inizio:", start);
    console.log("Data fine:", end);

    // Query con LEFT JOIN per ottenere gli orari e verificare se sono già prenotati
    db.query(
      `SELECT 
        O.ID_Orario, 
        O.Orario_Inizio, 
        O.Orario_Fine, 
        O.Giorno, 
        A.ID_Appuntamento, 
        A.data
      FROM orario O
      LEFT JOIN appuntamento A 
        ON O.ID_Orario = A.ID_Orario 
        AND A.ID_Veterinario = O.ID_Veterinario
        AND A.data BETWEEN ? AND ?
      WHERE O.ID_Veterinario = ?;`,
      [start, end, id_veterinario],
      (err, results) => {
        if (err) {
          console.error("Errore nella query con LEFT JOIN:", err);
          return res.status(500).json({ error: err.message });
        }

        console.log("Risultati ottenuti:", results);

        // Creiamo gli eventi disponibili
        const events = results.map(row => ({
          id: `${row.ID_Orario}-${row.data ? new Date(row.data).toISOString().split('T')[0] : 'libero'}`,
          title: row.ID_Appuntamento ? 'Prenotato' : 'Orario disponibile',
          start: row.data ? `${row.data}T${row.Orario_Inizio}` : null,
          end: row.data ? `${row.data}T${row.Orario_Fine}` : null,
          extendedProps: {
            ID_Orario: row.ID_Orario,
            Giorno: row.Giorno,
            Orario_Inizio: row.Orario_Inizio,
            Orario_Fine: row.Orario_Fine,
            Prenotato: !!row.ID_Appuntamento
          }
        })).filter(event => event.start); // Filtra solo gli eventi con una data valida

        return res.status(200).json(events);
      }
    );
  } else {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }
}
