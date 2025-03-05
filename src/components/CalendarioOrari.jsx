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
  const [errorMessage, setErrorMessage] = useState('');

  // Definisci localStartDate e localEndDate nel contesto del modal
  const localStartDate = selectedEvent ? toZonedTime(new Date(selectedEvent.start), 'Europe/Rome') : null;
  const localEndDate = selectedEvent ? toZonedTime(new Date(selectedEvent.end), 'Europe/Rome') : null;

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
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
          title: appuntamento.ID_Utente === userId ? 'Il tuo appuntamento' : 'Occupato',
          start: `${dataAppuntamento}T${orario.Orario_Inizio}`,
          end: `${dataAppuntamento}T${orario.Orario_Fine}`,
          description: appuntamento.Descrizione,
          orarioId: appuntamento.ID_Orario,
          backgroundColor: appuntamento.ID_Utente === userId ? '#4a90e2' : '#ff4444', // Blu per i propri appuntamenti
          borderColor: appuntamento.ID_Utente === userId ? '#357abd' : '#cc0000',
          userId: appuntamento.ID_Utente, // Aggiungi l'ID_Utente all'evento
          isClickable: appuntamento.ID_Utente === userId, // Flag per indicare se l'evento è cliccabile
          veterinarioNome: appuntamento.Nome,
          veterinarioCognome: appuntamento.Cognome
        };

      });

      console.log('Eventi appuntamenti creati:', eventiAppuntamenti.length);

      // Poi creiamo gli eventi per gli orari ricorrenti
      // usiamo flatmap perche' vogliamo creare piu' eventi per ogni orario o 0 eventi se non ci sono le condizioni
      const eventiOrari = orariDisponibili.flatMap(orario => {
        const events = [];
        
        // Prendiamo il primo e l'ultimo giorno del mese
        const currentDate = selectedDate;
        console.log('Data selezionata:', currentDate);
        // Troviamo il mese che stiamo visualizzando
        const viewMonth = currentDate.getMonth();
        const viewYear = currentDate.getFullYear();
        console.log('Mese visualizzato:', viewMonth + 1, viewYear);
        
        // Creiamo il primo e l'ultimo giorno del mese che stiamo visualizzando
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
        console.log('Primo giorno del mese:', firstDayOfMonth);
        const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);
        console.log('Ultimo giorno del mese:', lastDayOfMonth);
        
        // Prendiamo la data di oggi
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resettiamo l'ora a mezzanotte
        console.log('Data di today a mezzanotte:', today);
        
        console.log('Processo orario per il mese corrente:', {
          orario: orario.Giorno,
          orarioInizio: orario.Orario_Inizio,
          orarioFine: orario.Orario_Fine,
          meseCorrente: viewMonth + 1,
          anno: viewYear,
          dal: format(firstDayOfMonth, 'yyyy-MM-dd'),
          al: format(lastDayOfMonth, 'yyyy-MM-dd'),
          oggi: format(today, 'yyyy-MM-dd')
        });


        // Iteriamo su tutti i giorni del mese
        let currentDay = new Date(firstDayOfMonth);
        console.log('Inizio iterazione giorni:', currentDay);
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
                  orarioId: orario.ID_Orario,
                  backgroundColor: '#4CAF50',
                  borderColor: '#388E3C',
                  veterinarioNome: orario.Nome,
                  veterinarioCognome: orario.Cognome
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

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/getEventsUtente');
      
      const { orari, appuntamenti } = response.data;
      console.log('Dati memorizzati:');
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


// Modifica la funzione handleEventClick
const handleEventClick = (info) => {
  const event = info.event;
  
  if (event.title === 'Occupato' && !event.extendedProps.isClickable) {
    return;
  }

  if (event.title === 'Il tuo appuntamento') {
    setSelectedEvent(event);
    setIsModalOpen(true);
  } else if (event.title === 'Prenotabile') {
    // Verifica se l'utente ha già un appuntamento
    const hasExistingAppointment = appuntamenti.some(app => app.ID_Utente === userId);
    
    if (hasExistingAppointment) {
      setErrorMessage('Hai già un appuntamento prenotato. Cancella quello esistente prima di prenotarne uno nuovo.');
      setIsModalOpen(true);
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  }
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
      
      const response = await axios.post('/api/menageAppointment', {
        ID_Orario: originalOrarioId,
        Descrizione: description,
        ID_Veterinario: 25, // TODO: rendere dinamico
        data: selectedEvent.startStr
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

  // Aggiungi questa funzione dopo createAppointment
const deleteAppointment = async () => {
  try {
    const response = await axios.delete('/api/menageAppointment', {
      data: {
        ID_Appuntamento: selectedEvent.id,
        ID_Utente: userId // Per verificare che sia l'utente corretto
      }
    });

    console.log('Appuntamento cancellato:', selectedEvent.id);
    
    // Chiudi il modal e aggiorna gli eventi
    setIsModalOpen(false);
    fetchEvents(format(new Date(selectedEvent.start), 'yyyy-MM-dd'));
  } catch (error) {
    console.error('Errore nella cancellazione dell\'appuntamento:', error);
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
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay,dayGridMonth,listWeek'
        }}
        events={events}
        allDaySlot={false}
        locale="it"
        height="auto"
        eventClick={handleEventClick}
        timeZone="Europe/Rome"
        datesSet={handleDatesSet}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Formato 24 ore
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // Formato 24 ore
        }}
      />

{/* Modal unificato per tutti i tipi di eventi */}
<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel={selectedEvent?.title === 'Il tuo appuntamento' ? 'Dettagli Appuntamento' : 'Dettaglio Evento'}
  className="custom-modal"
  overlayClassName="custom-overlay"
>
<div className="modal-header">
    <h2>
      {errorMessage ? 'Attenzione' : 
        selectedEvent?.title === 'Il tuo appuntamento' 
          ? 'Dettagli appuntamento' 
          : 'Orario prenotabile'}
    </h2>
  </div>
  <div className="modal-content">
    {errorMessage ? (
      <>
      <p>{errorMessage}</p>
      <div className="modal-footer">
        <button type="button" onClick={() => {
          setErrorMessage('');
          closeModal();
        }}>Chiudi</button>
      </div>
      </>
    ) : selectedEvent?.title === 'Il tuo appuntamento' ? (
      // Contenuto per la visualizzazione dell'appuntamento
      <>
        <p><strong>Data:</strong> {localStartDate ? format(localStartDate, 'dd MMMM yyyy', { locale: it }) : ''}</p>
        <p><strong>Orario:</strong> {localStartDate ? format(localStartDate, 'HH:mm', { locale: it }) : ''} - {localEndDate ? format(localEndDate, 'HH:mm', { locale: it }) : ''}</p>
        <p><strong>Motivo:</strong> {selectedEvent?.extendedProps?.description}</p>
        <p><strong>Dott.</strong> {`${selectedEvent?.extendedProps?.veterinarioNome} ${selectedEvent?.extendedProps?.veterinarioCognome}`}</p>

        <div className="modal-footer">
          <button type="button" onClick={deleteAppointment}>Cancella</button>
          <button type="button" onClick={closeModal}>Chiudi</button>
        </div>
      </>
    ) : (
      // Contenuto per la prenotazione di un nuovo appuntamento
      <form onSubmit={(e) => {
        e.preventDefault();
        createAppointment();
      }}>
        <div className='form-group'>
          <label htmlFor='description'>Motivo:</label>
          <select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          >
            <option value="">Seleziona</option>
            <option value="Prima Visita">Prima Visita</option>
            <option value="Controllo">Controllo</option>
            <option value="Vaccinazione">Vaccinazione</option>
            <option value="Altro">Altro</option>
          </select>
        </div>
        <div className='info'>
          <p><strong>Data:</strong> {localStartDate ? format(localStartDate, 'dd MMMM yyyy', { locale: it }) : ''}</p>
          <p><strong>Fascia oraria:</strong> {localStartDate ? format(localStartDate, 'HH:mm', { locale: it }) : ''} - {localEndDate ? format(localEndDate, 'HH:mm', { locale: it }) : ''}</p>
          <p><strong>Veterinario:</strong> {`${selectedEvent?.extendedProps?.veterinarioNome} ${selectedEvent?.extendedProps?.veterinarioCognome}`}</p>
        </div>
        <div className="modal-footer">
          <button type="submit">Prenota</button>
          <button type="button" onClick={closeModal}>Chiudi</button>
        </div>
      </form>
    )}
  </div>
</Modal>
    </div>
  );
}

export default CalendarioOrari;