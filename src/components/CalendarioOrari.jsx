import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { it } from 'date-fns/locale';

function CalendarioOrari() {
  const [events, setEvents] = useState([]);
  const [orariDisponibili, setOrariDisponibili] = useState([]);
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);  // Per tenere traccia dell'evento selezionato
  const [isModalOpen, setIsModalOpen] = useState(false);  // Stato per aprire/chiudere il modal
  const [description, setDescription] = useState(''); // Stato per la descrizione
  const [userId, setUserId] = useState(null); // Stato per l'ID dell'utente
  const [selectedDate, setSelectedDate] = useState(null);

  // Definisci localStartDate e localEndDate nel contesto del modal
  const timeZone = 'Europe/Rome';
  const localStartDate = selectedEvent ? toZonedTime(new Date(selectedEvent.start), 'Europe/Rome') : null;
  const localEndDate = selectedEvent ? toZonedTime(new Date(selectedEvent.end), 'Europe/Rome') : null;

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      const today = format(new Date(), 'yyyy-MM-dd');
      fetchEvents(today);
    }
  }, [userId]);

  // Effetto per generare gli eventi quando cambiano orari o appuntamenti
  useEffect(() => {
    if (orariDisponibili.length > 0) {
      // Prima creiamo gli eventi per gli appuntamenti
      const eventiAppuntamenti = appuntamenti.map(appuntamento => {
        const orario = orariDisponibili.find(o => o.ID_Orario === appuntamento.ID_Orario);
        // Convertiamo la data dell'appuntamento in YYYY-MM-DD
        const dataAppuntamento = format(new Date(appuntamento.data), 'yyyy-MM-dd');
        
        console.log('Creo evento appuntamento:', {
          id: appuntamento.ID_Appuntamento,
          data: dataAppuntamento,
          orarioInizio: orario.Orario_Inizio,
          orarioFine: orario.Orario_Fine
        });

        return {
          id: appuntamento.ID_Appuntamento,
          title: 'Occupato',
          start: `${dataAppuntamento}T${orario.Orario_Inizio}`,
          end: `${dataAppuntamento}T${orario.Orario_Fine}`,
          description: appuntamento.Descrizione,
          stato: orario.Stato,
          orarioId: appuntamento.ID_Orario,
          backgroundColor: '#ff4444', // Rosso per gli appuntamenti
          borderColor: '#cc0000'
        };
      });

      // Poi creiamo gli eventi per gli orari ricorrenti
      const eventiOrari = orariDisponibili.flatMap(orario => {
        const events = [];
        
        // Prendiamo il primo e l'ultimo giorno del mese
        const currentDate = selectedDate || new Date();
        // Troviamo il mese che stiamo visualizzando
        const viewMonth = currentDate.getMonth();
        const viewYear = currentDate.getFullYear();
        
        // Creiamo il primo e l'ultimo giorno del mese che stiamo visualizzando
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
        
        // Prendiamo la data di oggi
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resettiamo l'ora a mezzanotte
        
        console.log('Processo orario per il mese corrente:', {
          orario: orario.Giorno,
          orarioInizio: orario.Orario_Inizio,
          meseCorrente: viewMonth + 1,
          anno: viewYear,
          dal: format(firstDayOfMonth, 'yyyy-MM-dd'),
          al: format(lastDayOfMonth, 'yyyy-MM-dd'),
          oggi: format(today, 'yyyy-MM-dd')
        });

        // Iteriamo su tutti i giorni del mese
        let currentDay = new Date(firstDayOfMonth);
        while (currentDay <= lastDayOfMonth) {
          // Verifichiamo che il giorno non sia nel passato
          if (currentDay >= today) {
            const dateString = format(currentDay, 'yyyy-MM-dd');
            const giornoSettimana = currentDay.getDay(); // 0-6 (0 = Domenica)
            
            // Se questo giorno è lo stesso dell'orario (es: è Lunedì e l'orario è per Lunedì)
            if (convertDayToNumber(orario.Giorno) === giornoSettimana) {
              // Controlliamo se c'è già un appuntamento
              const hasAppointment = appuntamenti.some(app => {
                // Convertiamo la data dell'appuntamento in YYYY-MM-DD
                const appDate = format(new Date(app.data), 'yyyy-MM-dd');
                return app.ID_Orario === orario.ID_Orario && appDate === dateString;
              });
              
              // Se non c'è appuntamento, creiamo l'orario disponibile
              if (!hasAppointment) {
                console.log('Creo orario disponibile:', {
                  data: dateString,
                  giorno: orario.Giorno,
                  ora: orario.Orario_Inizio
                });

                events.push({
                  id: `${orario.ID_Orario}-${dateString}`,
                  title: 'Prenotabile',
                  start: `${dateString}T${orario.Orario_Inizio}`,
                  end: `${dateString}T${orario.Orario_Fine}`,
                  description: 'Orario disponibile per prenotazione',
                  stato: orario.Stato,
                  orarioId: orario.ID_Orario,
                  backgroundColor: '#4CAF50',
                  borderColor: '#388E3C'
                });
              } else {
                console.log('Orario occupato:', {
                  data: dateString,
                  giorno: orario.Giorno,
                  ora: orario.Orario_Inizio
                });
              }
            }
          }
          
          // Passa al giorno successivo
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        return events;
      });

      // Combiniamo tutti gli eventi
      setEvents([...eventiAppuntamenti, ...eventiOrari]);
      console.log('Eventi totali creati:', {
        appuntamenti: eventiAppuntamenti.length,
        orariDisponibili: eventiOrari.length
      });
    }
  }, [orariDisponibili, appuntamenti, selectedDate]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('/api/session');
      setUserId(response.data.user.id);
    } catch (error) {
      console.error('Errore nel recupero dell\'ID utente:', error);
    }
  };

  const fetchEvents = async (selectedDate) => {
    try {
      console.log('Richiesta eventi per la data:', selectedDate);
      const response = await axios.get('/api/getEventsUtente', {
        params: { selectedDate }
      });
      
      const { orari, appuntamenti } = response.data;
      console.log('Dati ricevuti dal server:');
      console.log('Orari:', orari);
      console.log('Appuntamenti:', appuntamenti);

      setOrariDisponibili(orari);
      setAppuntamenti(appuntamenti);
    } catch (error) {
      console.error('Errore nel recupero eventi:', error);
    }
  };

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

  // Gestore del click sugli eventi
  const handleEventClick = (info) => {
    // Impedisce l'apertura del modal per gli appuntamenti già prenotati
    if (info.event.title === 'Occupato') {
      return;
    }

    // Imposta l'evento selezionato
    setSelectedEvent(info.event);
    setIsModalOpen(true);  // Apre il modal
  };

  // Funzione per chiudere il modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Funzione per creare l'appuntamento
  const createAppointment = async () => {
    try {
      // Estrai l'ID_Orario originale dall'id composto (es: da "90-2025-02-04" prende "90")
      const originalOrarioId = selectedEvent.extendedProps.orarioId;
      
      const response = await axios.post('/api/createAppointment', {
        ID_Orario: originalOrarioId,
        Descrizione: description,
        ID_Veterinario: 25, // TODO: rendere dinamico
        data: selectedEvent.startStr,
        Motivo: 'Visita'
      });

      console.log('Appuntamento creato:', {
        orarioId: originalOrarioId,
        data: selectedEvent.startStr,
        descrizione: description
      });

      // Chiudi il modal e aggiorna gli eventi
      setIsModalOpen(false);
      setDescription('');
      fetchEvents(format(new Date(selectedEvent.start), 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Errore nella creazione dell\'appuntamento:', error);
    }
  };

  // Funzione per gestire il cambio di date nel calendario
  const handleDatesSet = (arg) => {
    // Prendiamo il mese dalla data centrale della vista
    const viewDate = new Date((new Date(arg.start).getTime() + new Date(arg.end).getTime()) / 2);
    console.log('Cambio vista calendario:', {
      meseVisualizzato: viewDate.getMonth() + 1,
      anno: viewDate.getFullYear(),
      data: format(viewDate, 'yyyy-MM-dd')
    });
    setSelectedDate(viewDate);
    fetchEvents(format(viewDate, 'yyyy-MM-dd'));
  };

  return (
    <div className="calendario-appuntamenti">
      <h2>Calendario Appuntamenti</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek timeGridDay dayGridMonth'
        }}
        events={events}
        allDaySlot={false}
        locale="it"
        height="auto"
        eventClick={handleEventClick}
        timeZone="Europe/Rome"
        datesSet={handleDatesSet}
        
      />

      {/* Modal per visualizzare i dettagli dell'evento */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Dettaglio Evento"
        className="custom-modal" // Aggiungi una classe CSS personalizzata
        overlayClassName="custom-overlay" // Aggiungi una classe CSS per l'overlay
      >
        <div className="modal-header">
          <h2>Orario prenotabile</h2>
        </div>
        <div className="modal-content">
          <form onSubmit={(e) => {
            e.preventDefault();
            createAppointment();
          }}>
            <div>
              <label>Descrizione:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
            <p><strong>Data:</strong> {localStartDate ? format(localStartDate, 'dd MMMM yyyy', { locale: it }) : ''}</p>
              <p><strong>Fascia oraria:</strong> {localStartDate ? format(localStartDate, 'HH:mm', { locale: it }) : ''} - {localEndDate ? format(localEndDate, 'HH:mm', { locale: it }) : ''}</p>
            </div>
            <div className="modal-footer">
              <button type="submit">Prenota</button>
              <button type="button" onClick={closeModal}>Chiudi</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarioOrari;