import db from '../../../lib/db';
import { toZonedTime, format } from 'date-fns-tz';
import { it } from 'date-fns/locale';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { selectedDate } = req.query;

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
      // Log dei risultati originali
      console.log("Orari:", orari);
      console.log("Appuntamenti:", appuntamenti);

      // Fuso orario locale (Italia)
      const timeZone = 'Europe/Rome';

      // Mappiamo gli appuntamenti in modo da formare gli eventi per FullCalendar.
      const eventiAppuntamenti = appuntamenti.map(appuntamento => {
        const data = toZonedTime(new Date(appuntamento.data), timeZone);
        const isoDate = format(data, 'yyyy-MM-dd', { timeZone });
        const startDate = toZonedTime(new Date(isoDate + 'T' + orari.find(o => o.ID_Orario === appuntamento.ID_Orario).Orario_Inizio), timeZone);
        const endDate = toZonedTime(new Date(isoDate + 'T' + orari.find(o => o.ID_Orario === appuntamento.ID_Orario).Orario_Fine), timeZone);

        return {
          id: appuntamento.ID_Appuntamento,
          title: 'Occupato',
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          description: appuntamento.Descrizione,
          stato: orari.find(o => o.ID_Orario === appuntamento.ID_Orario).Stato
        };
      });

      console.log("Selected Date:", selectedDate);
console.log("Appuntamenti filtrati:", appuntamenti.filter(app => format(toZonedTime(new Date(app.data), timeZone), 'yyyy-MM-dd') === selectedDate));

      // Filtriamo le fasce orarie per rimuovere quelle che hanno appuntamenti nello stesso giorno
      const eventiOrari = orari.filter(orario => {
        return !appuntamenti
          .filter(appuntamento => format(toZonedTime(new Date(appuntamento.data), timeZone), 'yyyy-MM-dd') === selectedDate) // Filtra solo appuntamenti per la data richiesta
          .some(appuntamento => {
            const giornoAppuntamento = format(toZonedTime(new Date(appuntamento.data), timeZone), 'EEEE', { locale: it });
            const giornoOrario = format(toZonedTime(new Date(selectedDate), timeZone), 'EEEE', { locale: it });
      
            console.log("Controllo eliminazione:", {
              ID_Orario: appuntamento.ID_Orario,
              dataAppuntamento: format(toZonedTime(new Date(appuntamento.data), timeZone), 'yyyy-MM-dd'),
              giornoAppuntamento,
              giornoOrario
            });
      
            return appuntamento.ID_Orario === orario.ID_Orario && giornoAppuntamento === giornoOrario;
          });
      }).map(orario => {
        return {
          id: orario.ID_Orario,
          title: 'Orario Prenotabile',
          daysOfWeek: [convertDayToNumber(orario.Giorno)], // Converti il giorno in numero
          startTime: orario.Orario_Inizio,
          endTime: orario.Orario_Fine,
          description: 'Orario disponibile per prenotazione',
          stato: orario.Stato
        };
      });

      // Combiniamo gli eventi degli appuntamenti e delle fasce orarie
      const eventi = [...eventiOrari, ...eventiAppuntamenti];

      // Log degli eventi mappati
      console.log("Eventi mappati:", eventi);
      
      return res.status(200).json(eventi);
    })
    .catch(err => {
      console.error("Errore nel recupero degli eventi:", err);
      return res.status(500).json({ error: "Errore interno del server" });
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